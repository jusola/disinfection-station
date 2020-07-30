from main import thread_detection, thread_dispenser
import display
import time
import sys

try:
    thread_detection.start()
    thread_dispenser.start()
    while True:
	    display.runDisplay()
except KeyboardInterrupt:
    print("Keyboard interrupt")
    thread_detection.stop()
    thread_dispenser.stop()
    display.quitDisplay()
    sys.exit(0)
