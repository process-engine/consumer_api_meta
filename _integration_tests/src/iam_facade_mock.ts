import {IIdentity} from '@essential-projects/iam_contracts';
import {IIamFacade} from '@process-engine/process_engine_contracts';

export class IamFacadeMock implements IIamFacade {

  private _claimConfigs: any = {
      defaultUser: [
        'Default_Test_Lane',
        'LaneA',
        'LaneB',
        'LaneC',
      ],
      userWithAccessToSubLaneC: [
        'LaneA',
        'LaneC',
      ],
      userWithAccessToLaneA: [
        'LaneA',
      ],
      userWithNoAccessToLaneA: [
        'LaneB',
        'LaneC',
      ],
  };

  public async checkIfUserCanAccessLane(identity: IIdentity, laneId: string): Promise<boolean> {

    const identityName: string = identity.token;

    const matchingUserConfig: Array<string> = this._claimConfigs[identityName];

    if (!matchingUserConfig) {
      return false;
    }

    const userHasClaim: boolean = matchingUserConfig.some((claim: string): boolean => {
      return claim === laneId;
    });

    return userHasClaim;
  }
}
