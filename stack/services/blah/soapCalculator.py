from zeep import Client
import json
from services.shared.helper import (
    http_success,
)

client = Client(wsdl='http://www.dneonline.com/calculator.asmx?wsdl')


def add_nums(x, y):
    return client.service.Add(x, y)

def subtract_nums(x, y):
    return client.service.Subtract(x, y)

def divide_nums(x, y):
    return client.service.Divide(x, y)

def multiply_nums(x, y):
    return client.service.Multiply(x, y)


def lambda_handler(event, context):
    data = json.loads(event["body"])
    x = data["x"]
    print(x, type(x))
    y = data["y"]
    print(y, type(y))
    operator = data["operator"]
    print(operator, type(operator))
    answer = 0
    if operator == "add":
        answer = add_nums(x, y)
    elif operator == "sub":
        answer = subtract_nums(x, y)
    elif operator == "multi":
        answer = multiply_nums(x, y)
    elif operator == "divide":
        answer = divide_nums(x, y)
    return http_success(answer)