from main import thread_detection, thread_dispenser

try:
    thread_detection.start()
    thread_dispenser.start()
except KeyboardInterrupt:
    print("Keyboard interrupt")
    thread_dispenser.stop()
    thread_detection.stop()