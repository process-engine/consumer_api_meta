import * as jsonwebtoken from 'jsonwebtoken';

import {ForbiddenError} from '@essential-projects/errors_ts';
import {IIAMService, IIdentity} from '@essential-projects/iam_contracts';
import {DecodedIdentityToken} from '@process-engine/consumer_api_contracts';

export class IamServiceMock implements IIAMService {

  private _claimConfigs: any = {
      // Can access everything
      defaultUser: [
        'can_read_process_model',
        'can_write_process_model',
        'can_trigger_messages',
        'can_trigger_signals',
        'can_subscribe_to_events',
        'Default_Test_Lane',
        'LaneA',
        'LaneB',
        'LaneC',
      ],
      // Used for testing the process model filter
      restrictedUser: [
        'can_read_process_model',
      ],
      // Sublane Testuser
      userWithAccessToSubLaneC: [
        'can_read_process_model',
        'LaneA',
        'LaneC',
      ],
      // Sublane Testuser
      userWithAccessToLaneA: [
        'can_read_process_model',
        'LaneA',
      ],
      // Sublane Testuser
      userWithNoAccessToLaneA: [
        'can_read_process_model',
        'LaneB',
        'LaneC',
      ],
  };

  public async ensureHasClaim(identity: IIdentity, claimName: string): Promise<void> {

    const decodedToken: DecodedIdentityToken = this._decodeToken(identity.token);
    const identityName: string = decodedToken.sub;

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

  private _decodeToken(token: string): DecodedIdentityToken {
    const decodedToken: DecodedIdentityToken = <DecodedIdentityToken> jsonwebtoken.decode(token);

    return decodedToken;
  }
}
