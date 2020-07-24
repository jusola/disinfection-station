import dispenser
import facedetect

def onDispense():
    userid = facedetect.getFace()
    print(userid)

def end():
    facedetect.end()