from main import thread_detection, thread_dispenser
import time
import sys

try:
    thread_detection.start()
    thread_dispenser.start()
    while True: time.sleep(100)
except KeyboardInterrupt:
    print("Keyboard interrupt")
    thread_dispenser.stop()
    thread_detection.stop()
    sys.exit(0)