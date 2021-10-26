output frontend-bucket {  
    description = "string bucketname"  
    value       = terraform.workspace == "dev" ? module.serverless_frontend[0].frontend-bucket.id : null
}
output cloudfront {  
    description = "string distribution id"  
    value       = terraform.workspace == "dev" ? module.serverless_frontend[0].cloudfront.id : null
}
output domain {  
    description = "string base domain name"  
    value       = var.domain
}
