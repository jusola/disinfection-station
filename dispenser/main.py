import dispenser
import facedetect

def onDispense():
    name = facedetect.getFace()

def end():
    facedetect.end()