import { Construct } from 'constructs';
import { GoogleStackBase, BaseStackProps } from './stackbase';
import { ArtifactRegistryRepository } from '@cdktf/provider-google/lib/artifact-registry-repository'

export interface ArtRepoConfigs extends BaseStackProps {
    name: string,
    project: string,
    repoId: string,
    gcpProject: string,
    region: string,
}

export class ArtRepoStack extends GoogleStackBase {
    constructor(scope: Construct, id: string, props: ArtRepoConfigs) {
        super(scope, `${props.name}-${props.project}-${id}`, {
            name: props.name,
            project: props.project,
            region: props.region,
        })

        new ArtifactRegistryRepository (this, `${props.name}-${id}`, {
            repositoryId: props.repoId,
            location: props.region,
            project: props.gcpProject,
            format: "DOCKER"
        });
    }
}
