import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { App } from '@aws-cdk/core'
import * as ssp from '@aws-quickstart/ssp-amazon-eks';

export class PuccioTestClusterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const app = new App();
    const account = process.env.CDK_DEFAULT_ACCOUNT!;
    const region = process.env.CDK_DEFAULT_REGION;
    const env = { account: account, region: region };
    
    const blueprint = ssp.EksBlueprint.builder()
      .account(account)
      .region(region)
      .addOns()
      .teams();
    
      ssp.CodePipelineStack.builder()
      .name("puccio-test-cluster-pipeline")
      .owner("CarmenAPuccio")
      .repository({
          repoUrl: 'puccio-test-cluster',
          credentialsSecretName: 'puccio-github-personal-access-token',
          targetRevision: 'main'
      })
    
      .stage({
        id: 'prod',
        stackBuilder: blueprint.clone('us-east-1')
      })
      .build(app, 'puccio-test-cluster-pipeline-stack', {env})
  }
}
