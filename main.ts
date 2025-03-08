import { App } from 'cdktf';
import { BaseStackProps } from './lib/stacks/stackbase';
import { DnsZoneStack, DnsZoneConfigs } from './lib/stacks/dns-managed-zone-stack'
import { CmDnsAuthStack, CmDnsAuthConfigs } from './lib/stacks/certificate-manager-stack'
import { ArtRepoStack, ArtRepoConfigs } from './lib/stacks/artifact-repository-stack'
import { OsLoginStack } from './lib/stacks/os-login-stack'
import { ConnectionStack, ServiceConnectionConfigs } from './lib/stacks/service-connection-stack'
//import { RemoteBackend } from 'cdktf'; // uncomment this line to use Terraform Cloud

const StackProps: BaseStackProps = {
    name: "gcp",
    project: "friendlydevops",
    region: "us-central1"
}

const gcpProject = `${process.env.GCP_PROJECT}`
const domainSuffix= "com"

const CmDnsAuthProps: CmDnsAuthConfigs = {
    name: StackProps.name,
    project: StackProps.project,
    gcpProject: gcpProject,
    region: StackProps.region,
    domainSuffix: domainSuffix,
}

const app = new App();
const cmDnsAuth = new CmDnsAuthStack(app, "cmdns-stack", CmDnsAuthProps)

const DnsZoneProps: DnsZoneConfigs = {
    name: StackProps.name,
    project: StackProps.project,
    gcpProject: gcpProject,
    region: StackProps.region,
    domainSuffix: domainSuffix,
    cmDnsAuth: cmDnsAuth.cmDnsAuth
}

new DnsZoneStack(app, "dnszone-stack", DnsZoneProps)

const ArtRepoProps: ArtRepoConfigs = {
    name: StackProps.name,
    project: StackProps.project,
    gcpProject: gcpProject,
    region: StackProps.region,
    repoId: "github-runner"
}

new ArtRepoStack(app, "artrepo-stack", ArtRepoProps)

const WpArtRepoProps: ArtRepoConfigs = {
    name: StackProps.name,
    project: StackProps.project,
    gcpProject: gcpProject,
    region: StackProps.region,
    repoId: "wordpress"
}

new ArtRepoStack(app, "artrepo-wordpress-stack", WpArtRepoProps)

const NcArtRepoProps: ArtRepoConfigs = {
    name: StackProps.name,
    project: StackProps.project,
    gcpProject: gcpProject,
    region: StackProps.region,
    repoId: "nextcloud"
}

const ServiceConnectionIpProps: ServiceConnectionConfigs = {
    name: StackProps.name,
    project: StackProps.project,
    gcpProject: gcpProject,
    region: StackProps.region,
    ipRangeName: ["wordpress", "nextcloud"],
}

new ConnectionStack(app, "connection-stack", ServiceConnectionIpProps)

new ArtRepoStack(app, "artrepo-nexcloud-stack", NcArtRepoProps)

new OsLoginStack(app, "login-stack", StackProps)

// To deploy using Terraform Cloud comment out the above line
// And uncomment the below block of lines

/*const stack = new OsLoginStack(app, "login-stack", StackProps);
new RemoteBackend(stack, {
  hostname: "app.terraform.io",
  organization: process.env.CDKTF_GCP_TFC_ORGANIZATION || "",
  workspaces: {
    name: "ecs-microservices-cdktf"
  }
}); */

app.synth();
