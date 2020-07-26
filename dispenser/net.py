from config import config

port = config['net']['port']
host = config['net']['host']

def sendDispensed(userid):
    # print('sending net dispensed')
    return