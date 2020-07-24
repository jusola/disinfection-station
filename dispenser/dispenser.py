import main
import serial
import threading


# This maybe connects to arduino?

def dispense():
    print("Dispensing")
    main.onDispense()

while True:
    dispense()
    event = threading.Event()
    event.wait(5)