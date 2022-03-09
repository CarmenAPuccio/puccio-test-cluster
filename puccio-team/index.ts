import { ArnPrincipal } from '@aws-cdk/aws-iam';
import { ApplicationTeam } from '@aws-quickstart/ssp-amazon-eks';


export class TeamPuccio extends ApplicationTeam {
    constructor(accountID: string) {
        super({
            name: "team-puccio",
            users: [
                new ArnPrincipal(`arn:aws:iam::${accountID}:user/team-puccio-user1`)
            ],
        });
    }
}