import net
import display
from config import config

import base64
from otpauth import OtpAuth
import threading

event = threading.Event()

secret = config['auth']['secret']
period = int(config['auth']['period'])
useDispenser = config['dispenser'].getboolean('enabled')

base32secret = base64.b32encode(bytearray(secret, 'utf-8')).decode('ascii')

auth = OtpAuth(base32secret)

curFrame = None


def getCode():
    numcode = auth.totp(period=period)
    code = str(numcode)
    while(len(code) != 6):
        code = '0'+code
    return code

def getCurFrame():
    return curFrame

def onFaceDetect(userid, frame):
    global curFrame
    curFrame = frame
    if(userid != None):
        display.showCode(getCode())
        net.sendFace(userid)
    else:
        display.hideCode()
        net.sendNoFace()



def onDispense():
    global curFrame
    from facedetect import getCamFace
    userid, frame = getCamFace()
    curFrame = frame
    print("dispensing")
    if(userid):
        net.sendDispensed(userid)
        print("dispensed to "+userid)


def end():
    from facedetect import stopDetect
    stopDetect()

from facedetect import detectThread
thread_detection = detectThread(1, "Face detection thread")
if(useDispenser):
    print("using dispenser")
    from dispenser import dispenserThread
    thread_dispenser = dispenserThread(2, "Dispenser thread")