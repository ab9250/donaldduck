
#### Creating a DNS (a website name), this is done as a pull request the below details the steps no other request is needed


1. Clone this repository where you are storing your repo's
(copy and paste in a terminal) git clone git@github.com:procter-gamble/mypgs-aws-ou-administration.git

2. In your terminal type "code mypgs-aws-ou-administration" (without quotes you must be in the directory where your project is) this will open the project in visual studio

3.  Now that the project is open navigate to file dns\terraform\shared-dev.tf in the mypgs-aws-ou-administration project

Here you will need to add your website(DNS) as a resource in this exmaple it is donaldduck.hr.pg.com
---
>copy the below and paste in the shareddev.tf file
>
>>resource "aws_route53_zone" "primary_shared_dev_training_donald_duck" {
>>  provider = aws.shared_dev
>>  name     = "donaldduck.hr.pg.com"
>>}

resource "aws_ssm_parameter" "donald_duck_hosted_zone" {
  provider = aws.shared_dev
  name     = "donald_duck_dev_hosted_zone"
  type     = "String"
  value    = aws_route53_zone.primary_shared_dev_training_donald_duck.zone_id
}
>>
#### Step Two:

Now you need to add the resource to the shared-prod.tf folder, this is where all of the DNS names are kept for all of P&G.  

NOTE: you are not adding a prod site you are adding your dev site to the master file.  notice the resource is ns_shared_dev_donald_duck which is dev environment

navigate to file dns\terraform\shared-prod.tf in the mypgs-aws-ou-administration project

resource "aws_route53_record" "ns_shared_dev_donald_duck" {
  name    = "donaldduck.hr.pg.com"
  ttl     = 300
  type    = "NS"
  zone_id = aws_route53_zone.primary_shared_prod.zone_id

  records = [
    aws_route53_zone.primary_shared_dev_training_donald_duck.name_servers.0,
    aws_route53_zone.primary_shared_dev_training_donald_duck.name_servers.1,
    aws_route53_zone.primary_shared_dev_training_donald_duck.name_servers.2,
    aws_route53_zone.primary_shared_dev_training_donald_duck.name_servers.3,
  ]
}
#### Step two:
## Deploying

#### Step one: Deploying Terraform Components

```bash
cd stack/terraform
# change the s3 bucket name in main.tf to match your terraform state bucket in the account. Unfortunately terraform does not allow you to use variables in the backend declaration.
terraform workspace new <workspace name>
export TF_WORKSPACE=<workspace name>
terraform init
terraform plan
terraform apply
```

This will take a fair amount of time approximately 6 minutes because of cloudfront distribution, also take note of the output from terraform apply you will use that later in deploying the frontend.

**Known Issues**

- there are times when the DNS confirmation times out and you need to rerun `terraform apply`
- If your account is running cloud custodian sometimes there are issues adding the bucket policy if cloud custodian is also appending the policy, answer again is just to rerun `terraform apply`

#### Step two: Deploying Serverless stack

Before running make sure you have serverless installed globally `npm install -g serverless`

```bash
cd stack
npm install
serverless create_domain
serverless deploy
```

#### Step three: Deploying the frontend

```bash
cd frontend
npm install
# Edit the packag.json to include s3 bucket, cloudfront id, and domain from terraform output
npm run deploy
```
