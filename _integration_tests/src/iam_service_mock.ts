import {ForbiddenError} from '@essential-projects/errors_ts';
import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';

export class IamServiceMock implements IIAMService {

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

  public async ensureHasClaim(identity: IIdentity, claimName: string): Promise<void> {

    const identityName: string = identity.token;

    const matchingUserConfig: Array<string> = this._claimConfigs[identityName];

    if (!matchingUserConfig) {
      throw new ForbiddenError('access denied');
    }

    const userHasClaim: boolean = matchingUserConfig.some((claim: string): boolean => {
      return claim === claimName;
    });

    if (!userHasClaim) {
      throw new ForbiddenError('access denied');
    }
  }
}
