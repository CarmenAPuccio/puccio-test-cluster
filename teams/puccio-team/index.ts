import * as iam from '@aws-cdk/aws-iam';
import { ApplicationTeam } from '@aws-quickstart/ssp-amazon-eks';

export class TeamPuccio extends ApplicationTeam {
    constructor(accountID: string) {
        super({
            name: "team-puccio"
        });
    }
}