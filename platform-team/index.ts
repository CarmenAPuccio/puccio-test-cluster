import { PlatformTeam } from '@aws-quickstart/ssp-amazon-eks';

export class TeamPlatform extends PlatformTeam {
    constructor(accountID: string) {
        super({
            name: "team-platform",
            userRoleArn: `arn:aws:iam::${accountID}:role/Admin`
        })
    }
}