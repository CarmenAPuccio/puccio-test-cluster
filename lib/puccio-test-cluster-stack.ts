import { Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { App } from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as eks from '@aws-cdk/aws-eks'
import * as ssp from '@aws-quickstart/ssp-amazon-eks';
import { TeamPlatform } from '../platform-team';

export class PuccioTestClusterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const app = new App();
    const account = process.env.CDK_DEFAULT_ACCOUNT!;
    const region = process.env.CDK_DEFAULT_REGION;
    const env = { account: account, region: region };

    const clusterProps: ssp.MngClusterProviderProps = {
      minSize: 1,
      maxSize: 5,
      desiredSize: 3,
      instanceTypes: [new ec2.InstanceType('m5.large')],
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      nodeGroupCapacityType: eks.CapacityType.ON_DEMAND,
      version: eks.KubernetesVersion.V1_21,
      amiReleaseVersion: "1.21.5-20220303"
    }
    const clusterProvider = new ssp.MngClusterProvider(clusterProps);

    const blueprint = ssp.EksBlueprint.builder()
      .account(account)
      .region(region)
      .name("puccio-test-cluster")
      .addOns(
        new ssp.MetricsServerAddOn(),
        new ssp.ContainerInsightsAddOn(),
        new ssp.AwsLoadBalancerControllerAddOn(),
        new ssp.SSMAgentAddOn(),
        new ssp.XrayAddOn()
      )
      .teams(new TeamPlatform(account));

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
        stackBuilder: blueprint.clone().clusterProvider(clusterProvider)
      })
      .build(app, 'puccio-test-cluster-pipeline-stack', { env })
  }
}