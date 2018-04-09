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
  sh "docker stop ${dbContainerId}"
  sh "docker rm ${dbContainerId}"
  sh "docker rmi ${serverImageId} ${dbImageId}"

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

def upload_result_to_slack() {

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

          dbImage       = docker.build("consumertest_db_image:${image_tag}", '--file _integration_tests/Dockerfile.database _integration_tests')
          serverImage   = docker.build("consumertest_server_image:${image_tag}", '--no-cache --file _integration_tests/Dockerfile.tests _integration_tests')

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
          serverImage.inside("--env NODE_ENV=test --env CONFIG_PATH=/usr/src/app/application/config --env datastore__service__data_sources__default__adapter__server__host=db --link ${dbContainerId}:db") {
            errorCode = sh(script: "node /usr/src/app/node_modules/.bin/mocha /usr/src/app/test/**/*.js --exit > result.txt", returnStatus: true);
            testresults = sh(script: "cat result.txt", returnStdout: true).trim();

            test_failed = false;
            if (errorCode > 0) {
              test_failed = true;
            }
          }
        }
      }
    }
    stage('Publish') {
      steps {
        script {
          // Print the result to the jobs console
          println testresults;

          withCredentials([string(credentialsId: 'slack-file-poster-token', variable: 'SLACK_TOKEN')]) {

            def requestBody = [
              "token=${SLACK_TOKEN}",
              "content=${testresults}",
              "filename=consumer_api_integration_tests.txt",
              "channels=process-engine_ci"
            ]

            httpRequest(
              url: 'https://slack.com/api/files.upload',
              httpMode: 'POST',
              contentType: 'APPLICATION_FORM',
              requestBody: requestBody.join('&')
            )
          }

          // TODO: grep number of passing and failing from testresults and put them as result_string
          def passing = sh(script: "echo \"${testresults.replace('\n', '\\n')}\" | grep passing || echo \"0 passing\"", returnStdout: true).trim();
          def failing = sh(script: "echo \"${testresults.replace('\n', '\\n')}\" | grep failing || echo \"0 failing\"", returnStdout: true).trim();
          def pending = sh(script: "echo \"${testresults.replace('\n', '\\n')}\" | grep pending || echo \"0 pending\"", returnStdout: true).trim();
          
          println passing;
          println failing;
          println pending;

          def color_string     =  '"color":"good"';
          def markdown_string  =  '"mrkdwn_in":["text","title"]'
          def title_string     =  "\"title\":\":zap: Consumer tests for ${env.BRANCH_NAME} succeeded!\""
          def result_string    =  "\"text\":\"\""
          def action_string    =  "\"actions\":[{\"name\":\"open_jenkins\",\"type\":\"button\",\"text\":\"Open this run\",\"url\":\"${RUN_DISPLAY_URL}\"}]"


          if (test_failed == true) {
            color_string = '"color":"danger"';
            title_string =  "\"title\":\":zap: Consumer tests for ${env.BRANCH_NAME} failed!\""
          }
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
