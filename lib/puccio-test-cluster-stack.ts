import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as eks from 'aws-cdk-lib/aws-eks'
import * as blueprints from '@aws-quickstart/eks-blueprints';
import * as team from './teams';

const puccioManifestDir = './lib/teams/team-puccio/manifests/'

export class PuccioTestClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //const app = new cdk.App();
    const account = process.env.CDK_DEFAULT_ACCOUNT!;
    const region = process.env.CDK_DEFAULT_REGION;
    const env = { account: account, region: region };

    const clusterProps: blueprints.MngClusterProviderProps = {
      minSize: 1,
      maxSize: 5,
      desiredSize: 3,
      clusterName: "puccio-test-cluster",
      instanceTypes: [new ec2.InstanceType('m5.large')],
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      nodeGroupCapacityType: eks.CapacityType.ON_DEMAND,
      version: eks.KubernetesVersion.V1_22,
      amiReleaseVersion: "1.22.6-20220406"
    }
    const clusterProvider = new blueprints.MngClusterProvider(clusterProps);

    const blueprint = blueprints.EksBlueprint.builder()
      .account(account)
      .region(region)
      .name("puccio-test-cluster")
      .addOns(
        new blueprints.MetricsServerAddOn(),
        new blueprints.ContainerInsightsAddOn(),
        new blueprints.AwsLoadBalancerControllerAddOn(),
        new blueprints.SSMAgentAddOn(),
        new blueprints.XrayAddOn()
      )
      .teams(
        new team.TeamPlatform(account),
        new team.TeamPuccio(account, puccioManifestDir)
        );

        blueprints.CodePipelineStack.builder()
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
      .build(scope, 'puccio-test-cluster-pipeline-stack', { env })
  }
}