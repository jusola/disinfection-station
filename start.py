from main import thread_detection, getCurFrame
import display
import time
import cv2
import sys
from config import config

useDispenser = config['dispenser'].getboolean('enabled')

if(useDispenser):
	from main import thread_dispenser

try:
	thread_detection.start()
	if(useDispenser):
		thread_dispenser.start()
	while True:
		display.runDisplay()
		frame = getCurFrame()
		if(not frame is None):
			cv2.imshow("Video", frame)
			cv2.waitKey(1)
except KeyboardInterrupt:
	print("Keyboard interrupt")
	thread_detection.stop()
	if(useDispenser):
		thread_dispenser.stop()
	display.quitDisplay()
	cv2.destroyAllWindows()
	sys.exit(0)
