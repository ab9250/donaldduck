# import function_shield
import os
import logging
import boto3
import json
import decimal
from boto3.dynamodb.conditions import Key, Attr
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
import re
from math import floor


def get_dynamo_table():
    table_name = os.environ.get("tableName")
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table(table_name)
    return table


class NotFoundError(Exception):
    """Raised when item not found in database"""

    pass


class UnauthorizedError(Exception):
    """Raised user attempts to perform unauthorized action"""

    pass


class BadRequestError(Exception):
    """Raised when a user attempts to perform an action with a malformed or invalid request"""

    pass


def function_shield_block_all():
    logging.info("Adding block all function shield")
    token = os.environ.get("FUNCTION_SHIELD_TOKEN")
    if token is not None:
        function_shield.configure(
            {
                "policy": {
                    "outbound_connectivity": "block",
                    "read_write_tmp": "block",
                    "create_child_process": "block",
                    "read_handler": "block",
                    "disable_analytics": True,
                },
                "token": token,
            }
        )


def function_shield_alert_outbound():
    token = os.environ.get("FUNCTION_SHIELD_TOKEN")
    if token is not None:
        function_shield.configure(
            {
                "policy": {
                    "outbound_connectivity": "alert",
                    "read_write_tmp": "block",
                    "create_child_process": "block",
                    "read_handler": "block",
                    "disable_analytics": True,
                },
                "token": token,
            }
        )


def xray_init():
    patch_all()


def apigw_event(principal_id, body=None, pathParameters=None):
    """Generates API GW Event"""
    event = {"requestContext": {"authorizer": {"principalId": principal_id}}}
    if body is not None:
        event["body"] = json.dumps(body, ensure_ascii=False, default=decimal_default)
    if pathParameters is not None:
        event["pathParameters"] = pathParameters
    return event


def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return int(obj) if obj == floor(obj) else float(obj)
    raise TypeError


def get_record(table, pk, sk):
    response = table.get_item(Key={"pk": pk, "sk": sk})
    if "Item" not in response.keys():
        raise NotFoundError
    return response["Item"]

def get_creds(local, secret_name):
    """Get creds from local secrets file or secrets manager"""
    if local:
        logger.info("Retrieving creds local creds.py file")
        config = configparser.ConfigParser()
        config.read("secrets/creds.ini")
        creds = config["DEFAULT"]
    else:
        logger.info("Retrieving creds from AWS Secrets Manager")
        client = boto3.client("secretsmanager")
        response = client.get_secret_value(SecretId=secret_name)
        creds = json.loads(response["SecretString"])
    return creds


def validate_date(date_string):
    if not isinstance(date_string, str):
        raise UnauthorizedError
    if not re.match(
        # YYYY-MM-DD
        r"^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$",
        date_string,
    ):
        raise UnauthorizedError
    return date_string


def http_internal_error(event={}, origin="*"):
    logging.error(event)
    return build_response("500", {"message": "Internal Server Error"}, origin)


def http_not_found(origin="*"):
    return build_response("404", {"message": "Item Not Found"}, origin)


def http_unauthorized(origin="*"):
    return build_response("403", {"message": "Unauthorized"}, origin)


def http_bad_request(origin="*"):
    return build_response("400", {"message": "Bad Request"}, origin)


def http_success(body, origin="*"):
    return build_response("200", body, origin)


def build_response(status_code, body, origin="*"):
    origin = os.environ.get("ORIGIN", default=origin)
    response = {
        "statusCode": status_code,
        "body": json.dumps(body, ensure_ascii=False, default=decimal_default),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": True,
        },
    }
    return response


def dynamo_dumps(data):
    return json.dumps(data, ensure_ascii=False, default=decimal_default)


def setup_logger():
    """Setup console loggers (in lambda this is also a file logger)"""
    logger_init = logging.getLogger()
    if len(logger_init.handlers) > 0:
        handler = logger_init.handlers[0]
        formatter = logging.Formatter(
            "[%(levelname)s - %(filename)s:%(lineno)s - %(funcName)s] - %(message)s",
            "%m/%d/%y %H:%M:%S %Z",
        )
        handler.setFormatter(formatter)
    return logger_init


logger = setup_logger()
