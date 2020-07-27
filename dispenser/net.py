from config import config

import requests
import urllib.parse

address = config['net']['address']
transferToken = config['net']['transferToken']

def sendDispensed(userid):
    # print('sending net dispensed')
    finalAddress = urllib.parse.urljoin(address, 'comm/addScore')
    print(finalAddress)
    return

def sendNoFace():
    # here we should make a https request to nodejs server
    finalAddress = urllib.parse.urljoin(address, 'comm/setFace')
    print(finalAddress)
    return

def sendFace(userid):
    # here we should make a https request to nodejs server
    finalAddress = urllib.parse.urljoin(address, 'comm/setFace')
    print(finalAddress)
    return

def post(address, body):
    