variable "table_billing_mode" {
    type        = string
    description = "(Optional) Controls how you are charged for read and write throughput and how you manage capacity. The valid values are PROVISIONED and PAY_PER_REQUEST. Defaults to PAY_PER_REQUEST."
    default     = "PAY_PER_REQUEST"
}

variable "table_hash_key" {
    type        = string
    description = "(Required, Forces new resource) The attribute to use as the hash (partition) key. Must also be defined as an attribute. Defaults to 'pk'"
    default     = "pk"
}
variable "table_range_key" {
    type        = string
    description = "(Optional, Forces new resource) The attribute to use as the range (sort) key. Must also be defined as an attribute. Defaults to 'sk'"
    default     = ""
}

variable "table_write_capacity" {
    type        = number
    description = "(Optional) The number of write units for this table. If the billing_mode is PROVISIONED, this field is required."
    default     = -1
}

variable "table_read_capacity" {
    type        = number
    description = "(Optional) The number of read units for this table. If the billing_mode is PROVISIONED, this field is required."
    default     = -1
}


variable "table_attributes" {
type = list(object({
    name = string
    type = string
}))
description = "(Required) List of nested attribute definitions. Only required for hash_key and range_key attributes. Each attribute has two properties: 1. name (Required) The name of the attribute 2. type - (Required) Attribute type, which must be a scalar type: S, N, or B for (S)tring, (N)umber or (B)inary data"
default = [
    {
    name = "pk"
    type = "S"
    }
]
}

variable "table_ttl" {
type = object({
    enabled        = bool
    attribute_name = string
})
description = "(Optional) Defines ttl, has two properties: 1. enabled - (Required) Indicates whether ttl is enabled (true) or disabled (false) 2. attribute_name - (Required) The name of the table attribute to store the TTL timestamp in."
default     = { enabled = false, attribute_name = null }
}

variable "table_local_secondary_indexes" {
type = list(object({
    name               = string
    range_key          = string
    projection_type    = string
    non_key_attributes = list(string)
}))
description = "(Optional, Forces new resource) Describe an LSI on the table; these can only be allocated at creation so you cannot change this definition after you have created the resource."
default     = []
}

variable "table_global_secondary_indexes" {
type = list(object({
    name      = string
    hash_key  = string
    range_key = string
    # write_capacity     = number
    # read_capacity      = number
    projection_type = string
    # non_key_attributes = list(string)
}))
description = "(Optional) Describe a GSI for the table; subject to the normal limits on the number of GSIs, projected attributes, etc."
default = []
}

variable "table_server_side_encryption" {
    type        = bool
    description = "(Optional) Whether or not to enable encryption at rest using an AWS managed Customer Master Key. If enabled is false then server-side encryption is set to AWS owned CMK (shown as DEFAULT in the AWS console). If enabled is true then server-side encryption is set to AWS managed CMK (shown as KMS in the AWS console). Default is true."
    default     = true
}

variable "table_point_in_time_recovery" {
    type        = bool
    description = "(Optional) Whether to enable point-in-time recovery - note that it can take up to 10 minutes to enable for new tables. If the point_in_time_recovery block is not provided then this defaults to false."
    default     = false
}

locals {
    dynamic_ttl = var.table_ttl.enabled ? [var.table_ttl] : []
}

resource "aws_dynamodb_table" "db" {
    # count          = length(var.table_names)
    name           = "mypgs-training-2-user"
    billing_mode   = var.table_billing_mode == "" ? null : var.table_billing_mode
    write_capacity = var.table_billing_mode == "PAY_PER_REQUEST" ? null : var.table_write_capacity
    read_capacity  = var.table_billing_mode == "PAY_PER_REQUEST" ? null : var.table_read_capacity
    hash_key       = var.table_hash_key
    range_key      = var.table_range_key == "" ? null : var.table_range_key

    dynamic "ttl" {
        for_each = [for t in local.dynamic_ttl : {
            enabled        = t.enabled
            attribute_name = t.attribute_name
        }]

        content {
            enabled        = ttl.value.enabled
            attribute_name = ttl.value.attribute_name
        }
    }

    dynamic "attribute" {
            for_each = [for a in var.table_attributes : {
            name = a.name
            type = a.type
        }]

        content {
            name = attribute.value.name
            type = attribute.value.type
        }
    }

    dynamic "local_secondary_index" {
            for_each = [for lsi in var.table_local_secondary_indexes : {
            name               = lsi.name
            range_key          = lsi.range_key
            projection_type    = lsi.projection_type
            non_key_attributes = lookup(lsi, "non_key_attributes", null)
        }]

        content {
            name               = local_secondary_index.value.name
            range_key          = local_secondary_index.value.range_key
            projection_type    = local_secondary_index.value.projection_type
            non_key_attributes = local_secondary_index.value.non_key_attributes
        }
    }

    dynamic "global_secondary_index" {
        for_each = [for gsi in var.table_global_secondary_indexes : {
        name               = gsi.name
        write_capacity     = var.table_billing_mode == "PAY_PER_REQUEST" ? null : gsi.write_capacity
        read_capacity      = var.table_billing_mode == "PAY_PER_REQUEST" ? null : gsi.read_capacity
        hash_key           = gsi.hash_key
        range_key          = gsi.range_key == "" ? null : gsi.range_key
        projection_type    = gsi.projection_type
        non_key_attributes = lookup(gsi, "non_key_attributes", null)
        }]

        content {
            name               = global_secondary_index.value.name
            write_capacity     = global_secondary_index.value.write_capacity
            read_capacity      = global_secondary_index.value.read_capacity
            hash_key           = global_secondary_index.value.hash_key
            range_key          = global_secondary_index.value.range_key
            projection_type    = global_secondary_index.value.projection_type
            non_key_attributes = global_secondary_index.value.non_key_attributes
        }
    }

    server_side_encryption {
        enabled = var.table_server_side_encryption
    }

    point_in_time_recovery {
        enabled = terraform.workspace == "prod" ? true : var.table_point_in_time_recovery
    }

}