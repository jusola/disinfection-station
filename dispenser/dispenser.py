import serial
import threading

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
    def stop():
        self.running = False

#ser = serial.Serial('/dev/ttyUSB0')
# This connects to arduino via serial
def readSerial(thread):
    from main import onDispense
    while thread.running:
        #line = ser.readline()
        #if(line == 'd'):
        #    onDispense()
        event.wait(5)
        onDispense()