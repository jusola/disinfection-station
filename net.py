from config import config

import requests
import urllib.parse

address = config['net']['address']
transferToken = config['net']['transferToken']

def sendDispensed(userid):
    # print('sending net dispensed')
    finalAddress = urllib.parse.urljoin(address, 'comm/addScore')
    data = {
        'userid': userid,
        'transferToken': transferToken
    }
    post(finalAddress, data)
    return

def sendNoFace():
    # here we should make a https request to nodejs server
    finalAddress = urllib.parse.urljoin(address, 'comm/setFace')
    data = {
        'userid': None,
        'transferToken': transferToken
    }
    post(finalAddress, data)
    return

def sendFace(userid):
    # here we should make a https request to nodejs server
    finalAddress = urllib.parse.urljoin(address, 'comm/setFace')
    data = {
        'userid': userid,
        'transferToken': transferToken
    }
    post(finalAddress, data)
    return

def post(address, data):
    try:
        r = requests.post(address, data)
        return r
    except:
        print('Error while posting')
