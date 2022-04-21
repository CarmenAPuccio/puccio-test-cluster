import { ArnPrincipal } from 'aws-cdk-lib/aws-iam'
import { PlatformTeam } from '@aws-quickstart/eks-blueprints';

export class TeamPlatform extends PlatformTeam {
    constructor(accountID: string) {
        super({
            name: "platform",
            userRoleArn: `arn:aws:iam::${accountID}:role/Admin`,
            // The below is currently a bug. When userRoleArn is specified, there needs to be a at least one user.
            users: [new ArnPrincipal(`arn:aws:sts::${accountID}:assumed-role/Admin/puccio-Isengard`)]
        });
    }
}