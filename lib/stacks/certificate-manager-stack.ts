import { Construct } from 'constructs';
import { GoogleStackBase, BaseStackProps } from './stackbase';
import { CertificateManagerDnsAuthorization } from '@cdktf/provider-google/lib/certificate-manager-dns-authorization'
import { CertificateManagerCertificateMap } from '@cdktf/provider-google/lib/certificate-manager-certificate-map'
//import { CertificateManagerCertificate } from '@cdktf/provider-google/lib/certificate-manager-certificate'

export interface CmDnsAuthConfigs extends BaseStackProps {
    name: string,
    project: string,
    gcpProject: string,
    region: string,
    domainSuffix: string,
}

export class CmDnsAuthStack extends GoogleStackBase {
    public cmDnsAuth: CertificateManagerDnsAuthorization;
    constructor(scope: Construct, id: string, props: CmDnsAuthConfigs) {
        super(scope, `${props.name}-${props.project}-${id}`, {
            name: props.name,
            project: props.project,
            region: props.region,
        })

        this.cmDnsAuth = new CertificateManagerDnsAuthorization (this, `${props.name}-${id}`, {
            name: `${props.project}-auth`,
            domain: `${props.name}.${props.project}.${props.domainSuffix}`,
            project: props.gcpProject
        });

        new CertificateManagerCertificateMap (this, `${props.name}-certmap-${id}`, {
            name: `${props.project}-cert-map`,
            project: props.gcpProject
        });

/*
        new CertificateManagerCertificate (this, `${props.name}-cert-${id}`, {
            name: `${props.project}-cert`,
            location: props.region,
            managed: {
                domains: [ this.cmDnsAuth.domain ],
                dnsAuthorizations: [ this.cmDnsAuth.id ]
            },
            project: props.gcpProject
        });
        */
    }
}
