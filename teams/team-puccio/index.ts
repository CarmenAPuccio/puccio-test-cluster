import * as iam from '@aws-cdk/aws-iam';
import { ApplicationTeam } from '@aws-quickstart/ssp-amazon-eks';

const puccioManifestDir = './manifests/'

export class TeamPuccio extends ApplicationTeam {
    constructor(accountID: string) {
        super({
            name: "puccio",
            teamManifestDir: puccioManifestDir
        });
    }
}