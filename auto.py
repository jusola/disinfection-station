import time
from drv8835 import DRV8835
import RPi.GPIO as GPIO

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
    time.sleep(t)
    car.stop()
def dispense():

    run(100,2)
    run(-100,1)


#run(100,3)
#exit()
while True:
    x = etaisyys()
    print(x)
    if x <= 20:
        dispense()
        time.sleep(2)
    time.sleep(0.1)
while True:
    c = input()
    if c == "":
        run(100, 1)
    elif c == "d":
        dispense()
    else:
        run(-100,1)