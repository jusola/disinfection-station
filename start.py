from main import thread_detection#, thread_dispenser
from display import runDisplay, quitDisplay
import time
import sys

try:
    thread_detection.start()
    #thread_dispenser.start()
    while True: 
        runDisplay()
except KeyboardInterrupt:
    
    print("Keyboard interrupt")
    thread_detection.stop()
#    thread_dispenser.stop()
    quitDisplay()
    sys.exit(0)
