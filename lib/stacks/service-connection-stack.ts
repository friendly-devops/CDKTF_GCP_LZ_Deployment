import { Construct } from 'constructs';
import { GoogleStackBase, BaseStackProps } from './stackbase';
import { ComputeGlobalAddress } from '@cdktf/provider-google/lib/compute-global-address'
import { ServiceNetworkingConnection } from '@cdktf/provider-google/lib/service-networking-connection'
import { DataGoogleComputeNetwork } from '@cdktf/provider-google/lib/data-google-compute-network'

export interface ServiceConnectionConfigs extends BaseStackProps {
    name: string,
    project: string,
    gcpProject: string,
    region: string,
    ipRangeName: string[],
}

export class ConnectionStack extends GoogleStackBase {
    constructor(scope: Construct, id: string, props: ServiceConnectionConfigs) {
        super(scope,  `${props.name}-${id}`, {
            name: `${props.name}`,
            project: `${props.project}`,
            region: `${props.region}`,
        })

        const network = new DataGoogleComputeNetwork(this, "network", {name: "default", project: props.gcpProject});

        let ipAddresses : Array<string> = [];
        props.ipRangeName.forEach((ipName) => {
            let intAddress = new ComputeGlobalAddress(this, `${ipName}-address`, {
                name: `${ipName}-int-address`,
                addressType: "INTERNAL",
                project: props.gcpProject,
                network: network.id,
                purpose: "VPC_PEERING",
                prefixLength: 24
            });
            ipAddresses.push(intAddress.name);
        });

        new ServiceNetworkingConnection(this, `${props.name}-${id}`, {
            network: network.id,
            service: "servicenetworking.googleapis.com",
            deletionPolicy: "ABANDON",
            reservedPeeringRanges: ipAddresses,
            updateOnCreationFail: true
        });

    }
}
