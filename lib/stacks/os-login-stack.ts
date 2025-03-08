import { Construct } from 'constructs';
import { GoogleStackBase, BaseStackProps } from './stackbase';
import { OsLoginSshPublicKey } from '@cdktf/provider-google/lib/os-login-ssh-public-key'

export class OsLoginStack extends GoogleStackBase {
    constructor(scope: Construct, id: string, props: BaseStackProps) {
        super(scope, `${props.name}-${props.project}-${id}`, {
            name: props.name,
            project: props.project,
            region: props.region,
        })

        new OsLoginSshPublicKey (this, `${props.name}-${id}`, {
            user: `${process.env.SSH_USER}`,
            key: `${process.env.SSH_KEY}`
        });
    }
}
