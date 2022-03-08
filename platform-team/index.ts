import { ArnPrincipal } from "@aws-cdk/aws-iam";

import { PlatformTeam } from '@aws-quickstart/ssp-amazon-eks';

export class TeamPlatform extends PlatformTeam {
    constructor(accountID: string) {
        super({
            name: "platform",
            users: [
                new ArnPrincipal(`arn:aws:iam::${accountID}:role/Admin`),
                new ArnPrincipal(`arn:aws:sts::${accountID}:assumed-role/Admin/puccio-Isengard`)]
        })
    }
}