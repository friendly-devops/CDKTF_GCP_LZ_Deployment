import { Construct } from 'constructs';
import * as cdktf from 'cdktf';
import { GoogleProvider } from '@cdktf/provider-google/lib/provider';
//import * fs from 'fs';


export interface BaseStackProps {
    name: string,
    project: string,
    region: string,
}

export class GoogleStackBase extends cdktf.TerraformStack {
    public _provider: cdktf.TerraformProvider;

    constructor(scope: Construct, id: string, baseProps: BaseStackProps) {
        super(scope, `${baseProps.project}-${id}`);
        this._provider = new GoogleProvider(this, 'google', {
            region: baseProps.region,
        })
        const bucketName =`${process.env.STATE_BUCKET}`

        new cdktf.GcsBackend(this, {
            bucket: bucketName,
            prefix: `${baseProps.project}/${id}`,
            //region: `${baseProps.region}`
        });

/*        get provider(): cdktf.TerraformProvider {
            return this._provider;
        }*/
    }
}
