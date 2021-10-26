import os
import pytest
from mock import patch
from aws_xray_sdk import global_sdk_config
import random
import sys


@pytest.fixture(scope="session", autouse=True)
def default_session_fixture(request):
    global_sdk_config.set_sdk_enabled(False)
    patched = patch.dict(
        os.environ,
        {
            "tableName": "unit-test-auth",
            "AWS_DEFAULT_REGION": "us-east-1",
            "PingClientID": "AWSServerlessTest",
            "JWKSUrl": "https://blah.com/",
            "AccessGroup": "",
            "GroupAttributes": "",
        },
    )
    patched.__enter__()

    def unpatch():
        patched.__exit__()

    request.addfinalizer(unpatch)
