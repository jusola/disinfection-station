import serial
import threading

from config import config

event = threading.Event()

class serialThread (threading.Thread):
    def __init__(self, threadID, name):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.running = False
    def run(self):
        self.running = True
        print("Starting " + self.name)
        readSerial(self)
        print("Exiting " + self.name)
    def stop(self):
        self.running = False

# This connects to arduino via serial
def readSerial(thread):
    from main import onDispense
    dev = config['dispenser']['device']
    ser = serial.Serial(dev)
    while thread.running:
        line = ser.readline()
        if(line == 'd'):
            onDispense()