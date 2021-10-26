import requests
import json
import os
from services.shared.helper import (
    http_success, get_creds
)


getSecret = os.environ.get("API_KEY")
secret = get_creds(False, getSecret)
api_key = secret["api_key"]


base_url= "https://api.openweathermap.org/data/2.5/weather"



def lambda_handler(event, context):
    print(secret)
    zipcode = event["queryStringParameters"]["zip"]
    print(api_key)
    unit = event["queryStringParameters"]["unit"]
    payload = {'zip': zipcode, 'units' : unit, 'appid': api_key}
    response = requests.get(base_url , params=payload)
    weather = response.json()
    return http_success(weather)




