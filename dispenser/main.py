import dispenser
import facedetect
import net
import display
from config import config

import base64
from otpauth import OtpAuth
import threading

event = threading.Event()

secret = config['auth']['secret']
period = int(config['auth']['period'])

base32secret = base64.b32encode(bytearray(secret, 'utf-8')).decode('ascii')

auth = OtpAuth(base32secret)

def onDispense():
    userid = facedetect.getCamFace()
    net.sendDispensed(userid)
    print(getCode())


def end():
    facedetect.end()

def getCode():
    numcode = auth.totp(period=period)
    code = str(numcode)
    while(len(code) != 6):
        code = '0'+code
    return code

while(True):
    userid = facedetect.getCamFace()
    if(userid != None):
        display.showCode(getCode())
        net.sendFace(userid)
    else:
        display.hideCode()
        net.sendNoFace()
    event.wait(5)