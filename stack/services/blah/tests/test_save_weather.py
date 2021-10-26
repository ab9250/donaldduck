import pytest
from mock import patch
from moto import mock_dynamodb2
import boto3
import json


def apigw_event(principal_id, body):
    """Generates API GW Event"""
    event = {
        "requestContext": {"authorizer": {"principalId": principal_id}},
        "body" : json.dumps(body)
    }
    

    return event

@mock_dynamodb2
def test_save_weather():
    from services.blah.saveWeather import lambda_handler
    dynamodb = boto3.resource('dynamodb')
    table_name = 'unit-test-auth'
    table = dynamodb.create_table(TableName = table_name,
    KeySchema=[{'AttributeName': 'pk','KeyType': 'HASH'}],
    AttributeDefinitions=[{'AttributeName': 'pk','AttributeType': 'S'}])
    body = {"country" : "US", "unit": "imperial", "zipcode": "11111"}
    principalId = 'user.1'
    api_event = apigw_event(principalId, body)
    resp = lambda_handler(api_event, None)
    print(resp)
    assert resp['statusCode'] == '200'


