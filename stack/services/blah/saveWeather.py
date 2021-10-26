from services.shared.helper import (get_dynamo_table, http_success)
import json



table = get_dynamo_table()


def lambda_handler(event, context):
        auth = event["requestContext"]["authorizer"]
        pk = auth["principalId"]
        body = json.loads(event["body"])
        table.update_item(
            Key={"pk": pk},
            UpdateExpression="SET saved_location = :location_data",
            ExpressionAttributeValues={
                ":location_data": body
            }
        )
        return http_success(body)