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

def getCode():
    numcode = auth.totp(period=period)
    code = str(numcode)
    while(len(code) != 6):
        code = '0'+code
    return code

def onFaceDetect(userid):
    if(userid != None):
        display.showCode(getCode())
        net.sendFace(userid)
    else:
        display.hideCode()
        net.sendNoFace()



def onDispense():
    from facedetect import getCamFace
    userid = getCamFace()
    if(userid):
        net.sendDispensed(userid)
        print("dispensed to "+userid)


def end():
    from facedetect import stopDetect
    stopDetect()

from facedetect import detectThread
from dispenser import serialThread
thread_detection = detectThread(1, "Face detection thread")
thread_dispenser = serialThread(2, "Serial thread")