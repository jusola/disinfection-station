import main
import serial
import threading


# This connects to arduino via serial

def dispense():
    print("Dispensing")
    main.onDispense()

while True:
    dispense()
    event = threading.Event()
    event.wait(5)