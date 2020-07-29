import serial
import threading
import time
from drv8835 import DRV8835
import RPi.GPIO as GPIO
from config import config

# GPIO tila (BOARD / BCM)
GPIO.setmode(GPIO.BCM)

# GPIO kaytettavat  pinnit
GPIO_TRIGGER = 20
GPIO_ECHO = 26
car = DRV8835() # if Pololulu Motoredriver is used
car.stop()
# GPIO-Pinnien toimintasuunta, asettaminen (IN / OUT)
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

event = threading.Event()

lastDistance = 0

threshold = int(config['dispenser']['threshold'])

class dispenserThread (threading.Thread):
    def __init__(self, threadID, name):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.running = False
    def run(self):
        self.running = True
        print("Starting " + self.name)
        runDispenser(self)
        onExit(self)
        print("Exiting " + self.name)
    def stop(self):
        self.running = False

# This connects to arduino via serial
def runDispenser(thread):
    from main import onDispense
    while thread.running:
        x = etaisyys()
        if x <= threshold and lastDistance > threshold:
            dispense()
            onDispense()
            event.wait(2)
        lastDistance = x
        event.wait(0.1)

def onExit(thread):
    pass

def etaisyys():
    # Aseta Trigger HIGH
    GPIO.output(GPIO_TRIGGER, True)

    # Aseta Trigger 0.01ms jalkeen LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    aloitus_aika = time.time()
    lopetus_aika = time.time()

    # Tallenna aloitus_aika
    while GPIO.input(GPIO_ECHO) == 0:
        aloitus_aika = time.time()

    # Tallenna lopetus_aika
    while GPIO.input(GPIO_ECHO) == 1:
        lopetus_aika = time.time()

    # Aikaero
    kulunut_aika = lopetus_aika - aloitus_aika
    # Aanennopeus (34300 cm/s)
    # jaetaan 2:lla, koska ultraääni menee edestakaisin
    etaisyys = (kulunut_aika * 34300) / 2

    return etaisyys

def run(power, t):
    if power>=0:
        car.forward(power)
    else:
        car.backward(-power)
    event.wait(t)
    car.stop()

def dispense():
    run(100,2)
    run(-100,1)