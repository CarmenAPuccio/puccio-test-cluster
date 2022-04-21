import { ApplicationTeam } from '@aws-quickstart/eks-blueprints';

export class TeamPuccio extends ApplicationTeam {
    constructor(accountID: string, teamManifestDir: string) {
        super({
            name: "puccio",
            teamManifestDir: teamManifestDir
        });
    }
}