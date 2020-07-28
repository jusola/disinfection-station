# Disinfection scoreboard
## Team Finland - First Global 2020

### RPI Setup guide:
* Install python3
* Clone dispenser folder to RPI
* Install with `pip3 install -r requirements.txt`
* Copy sample_config.ini to config.ini
* Change secret and transferToken in config.ini
* Change address in config.ini
* Connect arduino
* Check arduino serial device location against device in config.ini
* Start with `python3 start.py`

### Arduino:
Arduino should sendline `d` each time it dispenses.

## Structure:
* Arduino connected to raspberry pi
* RPI runs face detection and receives dispensions from Arduino
* Server runs somewhere (maybe virtual server?)
* RPI sends face detections and dispensions to server