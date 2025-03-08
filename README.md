# AWS Wordpress ECS deployment with CDKTF
## Architecture
![GCP Environment](images/gcp.png)
## Instructions
### This deployment requires the use of user Access Keys.
To deploy using deploy using Terraform Cloud, uncomment lines 7, 75-82 in main.ts and comment out line 70.

Comment out Config credentials in .github/workflows/deployment-workflow.yml

Add CDKTF_ECS_GCP_ORGANIZATION to the env block of CDKTF Deployment in .github/workflow/deployment-workflow.yml with the name of your organizatoin as the value.
### In the secrets and variables Actions menu, place the following key pairs
    1. GCP_WIP: <Workload Identity Federation Pool>
    2. GCP_SA_EMAIL: <Service Account Email>
    3. GCP_STATE_BUCKET: <backend_bucket_to_store_state>
    4. GCP_PROJECT: <GCP Project name>
    5. SSH_KEY: <id_rsa.pub file>

### Deploy Application:
    1. Navigate to the Actions tab
    2. Select Deployment Workflow on the left panel
    3. Select Run workflow
    4. Ensure the correct branch is selected
    6. Ensure deploy is selected in the drop down menu
    7. Run workflow

### Verify deployment by:
    1. Check Cloud DNS.
    2. Check Repositories.
    3. Check ssh keys.
    
### Destroy Application:
    1. Navigate to the Actions tab
    2. Select Deployment Workflow on the left panel
    3. Select Run workflow
    4. Ensure the correct branch is selected
    6. Ensure destroy is selected in the drop down menu
    7. Run workflow
