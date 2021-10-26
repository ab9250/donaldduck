import os
import pytest
from mock import patch
from aws_xray_sdk import global_sdk_config
from moto import mock_dynamodb2
import boto3
import random


@pytest.fixture(scope="session", autouse=True)
def default_session_fixture(request):
    global_sdk_config.set_sdk_enabled(False)
    patched = patch.dict(
        os.environ,
        {
            "tableName": "unit-test-helper",
            "TF_WORKSPACE": "test",
            "AWS_DEFAULT_REGION": "us-east-1",
        },
    )
    patched.__enter__()

    def unpatch():
        patched.__exit__()

    request.addfinalizer(unpatch)


@pytest.fixture(scope="function")
def aws_credentials():
    """Mocked AWS Credentials for moto."""
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_SECURITY_TOKEN"] = "testing"
    os.environ["AWS_SESSION_TOKEN"] = "testing"


@pytest.fixture(scope="function")
def dynamodb(aws_credentials):
    with mock_dynamodb2():
        table_name = os.environ.get("tableName")
        print(table_name)
        conn = boto3.client(
            "dynamodb",
            region_name="us-east-1",
            aws_access_key_id="ak",
            aws_secret_access_key="sk",
        )
        conn.create_table(
            TableName=table_name,
            KeySchema=[
                {"AttributeName": "pk", "KeyType": "HASH"},
                {"AttributeName": "sk", "KeyType": "RANGE"},
            ],
            AttributeDefinitions=[
                {"AttributeName": "pk", "AttributeType": "S"},
                {"AttributeName": "sk", "AttributeType": "S"},
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )

        yield conn

