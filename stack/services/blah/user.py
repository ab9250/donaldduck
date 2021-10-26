from services.shared.helper import xray_init

xray_init()

import json
from datetime import datetime
from decimal import Decimal
from services.shared.helper import (
    get_dynamo_table,
    get_record,
    http_success,
    http_internal_error,
    http_not_found,
    http_unauthorized,
    NotFoundError,
    UnauthorizedError,
)

table = get_dynamo_table()



def lambda_handler(event, context):
        auth = event["requestContext"]["authorizer"]
        pk = auth["principalId"]
        user = table.get_item(Key={"pk": pk})
        if "Item" not in user.keys():
            visit_count = 1
            table.put_item(
                Item={
                    "pk": pk,
                    "visit_count": visit_count

                }
            )
            user = table.get_item(Key={"pk": pk})

        else:
            table.update_item(
                Key={"pk": pk},
                UpdateExpression="SET visit_count = visit_count + :val",
                ExpressionAttributeValues={
                    ":val": Decimal(1),
                }
            )

        print(user["Item"])
        return http_success(user["Item"])
