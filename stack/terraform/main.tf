provider "aws" {
  region = "us-east-1"
}

data "aws_ssm_parameter" "hosted_zone" {
  name = "account_hosted_zone_training_2" #Added "training_2"
}

data "aws_ssm_parameter" "waf_arn" {
  name = "account_global_waf_arn"  #This changed from "waf_id" and "waf_acl_id" to "waf_arn"
}

data "aws_ssm_parameter" "log_bucket" {
  name = "account_logging_bucket"
}

data "aws_ssm_parameter" "lambda_key_id" {
  name = "account_lambda_key_id"
}

#added this
data "aws_ssm_parameter" "ping_client_id" {
  name = "account_ping_client_id"
}
#added this
data "aws_ssm_parameter" "ping_instance" {
  name = "account_ping_instance"
}

data "aws_ssm_parameter" "tf_state_bucket_name" {
  name = "account_terraform_state_name"
}

terraform {
  backend "s3" {
    bucket = "mypgs-edm-dev.tfstate" #Customized this with the bucket name
    key    = "donaldduck/terraform.tfstate" #and this
    region = "us-east-1"
  }
}
variable domain {
  type    = string
  default = "donaldduck.hr.pg.com"
}

variable stack_name {
  type    = string
  default = "donaldduck"
}

variable tags {
  type = object({
    Application_Name   = string
    Cost_Center        = string
    Application_Id     = string
    Stage              = string
    Original_Requestor = string
    Owning_Role        = string
  })
  default = {
    Application_Name   = "donaldduck"
    Cost_Center        = "1000556407"
    Application_Id     = "BLAHBLAHBLAHBLAH"
    Stage              = "dev"
    Original_Requestor = "bray.sd@pg.com"
    Owning_Role        = "CNF-DCT-NonProd-Developer-Test1"
  }
}


module serverless_frontend {
  #Sourced changed to different branch
  source = "git@github.com:procter-gamble/terraform-aws-template-serverless-frontend.git?ref=fix-initial-creation-error"  
  count =  1 #count added
  providers = {
    aws = aws
  }
  # disabled               = terraform.workspace == "prod" ? false : true *Removed this*
  stack_name             = var.stack_name
  stage                  = terraform.workspace
  domain                 = var.domain
  bucket_name            = "${var.stack_name}-${terraform.workspace}-frontend-bucket"
  hosted_zone            = data.aws_ssm_parameter.hosted_zone.value
  waf                    = data.aws_ssm_parameter.waf_arn.value #changed from waf_id
  s3_logging_bucket      = data.aws_ssm_parameter.log_bucket.value
  tags                   = var.tags
  ping_client_id         = "AWSServerlessTest"
  ping_adapter           = "ExcludeEBPAdapters" #added this
  ping_instance          = "fedauthtst.pg.com"
  cf_auth_app_id         = "arn:aws:serverlessrepo:us-east-1:324722364132:applications/pg-cloudfront-authorization-at-edge"  
  cf_auth_app_semver     = "3.0.1"  #this is different version
  cf_auth_app_reployment = "2"  #added this
  cf_log_enabled         = false #added this
}

