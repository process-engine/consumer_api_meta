def cleanup_workspace() {
  cleanWs()
  dir("${env.WORKSPACE}@tmp") {
    deleteDir()
  }
  dir("${env.WORKSPACE}@script") {
    deleteDir()
  }
  dir("${env.WORKSPACE}@script@tmp") {
    deleteDir()
  }
}

def cleanup_docker() {
  sh "docker stop ${serverContainerId} ${dbContainerId}"
  sh "docker rm ${serverContainerId} ${dbContainerId}"
  sh "docker rmi ${testsImageId} ${serverImageId} ${dbImageId}"

  // Build stages in dockerfiles leave dangling images behind (see https://github.com/moby/moby/issues/34151).
  // Dangling images are images that are not used anywhere and don't have a tag. It is safe to remove them (see https://stackoverflow.com/a/45143234).
  // This removes all dangling images
  sh "docker image prune --force"

  // Some Dockerfiles create volumes using the `VOLUME` command (see https://docs.docker.com/engine/reference/builder/#volume)
  // running the speedtests creates two dangling volumes. One is from postgres (which contains data), but i don't know about the other one (which is empty)
  // Dangling volumes are volumes that are not used anywhere. It is safe to remove them.
  // This removes all dangling volumes
  sh "docker volume prune --force"
}

pipeline {
  agent any

  stages {
    stage('Prepare') {
      steps {
        script {

          def first_seven_digits_of_git_hash = env.GIT_COMMIT.substring(0, 8)
          def safe_branch_name = env.BRANCH_NAME.replace("/", "_")
          def image_tag = "${safe_branch_name}-${first_seven_digits_of_git_hash}-b${env.BUILD_NUMBER}"

          dbImage       = docker.build("consumertest_db_image:${image_tag}", '--file _integration_tests/Dockerfile.database database')
          serverImage   = docker.build("consumertest_server_image:${image_tag}", '--no-cache --file _integration_tests/Dockerfile.tests tests')

          dbImageId     = dbImage.id
          serverImageId = serverImage.id

          dbContainerId = dbImage
                            .run('--env POSTGRES_USER=admin --env POSTGRES_PASSWORD=admin --env POSTGRES_DB=processengine')
                            .id

          // wait for the DB to start up
          docker
            .image('postgres')
            .inside("--link ${dbContainerId}:db") {
              sh 'while ! pg_isready -U postgres -h db ; do sleep 5; done'
          }
        }
      }
    }
    stage('Consumer Tests') {
      steps {
        script {
          // image.inside mounts the current Workspace as the working directory in the container
          serverImageId.inside() {
            testresults = sh(script: "node /usr/src/app/node_modules/.bin/mocha /usr/src/app/**/*.js --exit", returnStdout: true).trim();
          }
        }
      }
    }
    stage('Publish') {
      steps {
        script {
          // Print the result to the jobs console
          println testresults;

          color_string     =  '"color":"good"';
          markdown_string  =  '"mrkdwn_in":["text","title"]'
          title_string     =  "\"title\":\":zap: Speed tests for ${env.BRANCH_NAME} done!\""
          result_string    =  "\"text\":\"```${testresults.replace('\n','\\n')}```\""
          action_string    =  "\"actions\":[{\"name\":\"open_jenkins\",\"type\":\"button\",\"text\":\"Open this run\",\"url\":\"${RUN_DISPLAY_URL}\"}]"

          // send the measurements to slack
          slackSend attachments: "[{$color_string, $title_string, $markdown_string, $result_string, $action_string}]"
        }
      }
    }
    stage('Cleanup') {
      steps {
        script {
          // This stage just exists, so the cleanup work that happens
          // in the post script will show up in its own stage in Blue Ocean.
          sh(script: ':', returnStdout: true);
        }
      }
    }
  }
  post {
    always {
      script {

        cleanup_workspace()

        cleanup_docker()
      }
    }
  }
}
