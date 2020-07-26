import dispenser
import facedetect
import pyotp
import net
import base64
import hashlib

from config import config

from otpauth import OtpAuth

secret = config['auth']['secret']
period = int(config['auth']['period'])

base32secret = base64.b32encode(bytearray(secret, 'utf-8')).decode('ascii')

auth = OtpAuth(base32secret)

def onDispense():
    userid = facedetect.getCamFace()
    net.sendDispensed(userid)
    print(getCode())


def onGetFace():
    userid = facedetect.getCamFace()

def end():
    facedetect.end()

def getCode():
    numcode = auth.totp(period=period)
    code = str(numcode)
    while(len(code) != 6):
        code = '0'+code
    return code