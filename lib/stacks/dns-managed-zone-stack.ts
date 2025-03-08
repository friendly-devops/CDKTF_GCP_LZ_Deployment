import { Construct } from 'constructs';
import { GoogleStackBase, BaseStackProps } from './stackbase';
import { CertificateManagerDnsAuthorization } from '@cdktf/provider-google/lib/certificate-manager-dns-authorization'
import { DnsManagedZone } from '@cdktf/provider-google/lib/dns-managed-zone'
import { DnsRecordSet } from '@cdktf/provider-google/lib/dns-record-set'

export interface DnsZoneConfigs extends BaseStackProps {
    name: string,
    project: string,
    gcpProject: string,
    region: string,
    domainSuffix: string,
    cmDnsAuth: CertificateManagerDnsAuthorization,
}

export class DnsZoneStack extends GoogleStackBase {
    constructor(scope: Construct, id: string, props: DnsZoneConfigs) {
        super(scope, `${props.name}-${props.project}-${id}`, {
            name: props.name,
            project: props.project,
            region: props.region,
        })

        const zone = new DnsManagedZone (this, `${id}`, {
            name: `${props.project}-auth`,
            dnsName: `${props.name}.${props.project}.${props.domainSuffix}.`,
            project: props.gcpProject
        });

        const record = new DnsRecordSet (this, `${props.name}-${id}`, {
            name: "${each.value.name}",
            type: "${each.value.type}",
            rrdatas: [
                "${each.value.data}"
            ],
            ttl: 60,
            managedZone: zone.name,
            project: props.gcpProject
        });

        record.addOverride('for_each', `\${{
            for drr in ${props.cmDnsAuth.fqn}.dns_resource_record : drr.name => {
              name   = drr.name
              data = drr.data
              type   = drr.type
            }
          }
        }`)
    }
}

