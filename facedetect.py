import face_recognition
import cv2
import numpy as np

from os import listdir
from os import path

import threading
import uuid

event = threading.Event()

from config import config

# Get a reference to webcam #0 (the default one)
video_capture = cv2.VideoCapture(0)
facedir = 'faces'

known_face_encodings = []
known_face_userids = []

min_face_size = int(config['detection']['minsize'])
scale = int(config['detection']['scale'])

# Load known faces
for f in listdir(facedir):
    filePath = path.join(facedir, f)
    if (path.isfile (filePath)):
        img = face_recognition.load_image_file(filePath)
        enc = face_recognition.face_encodings(img)[0]
        known_face_encodings.append(enc)
        userid = f.split('.')[0]
        known_face_userids.append(userid)
        print('Added face: '+userid)

# Initialize some variables
face_locations = []
face_encodings = []
face_userids = []
unrec_encodings = [] # unrecognized faces, if here for two frames, add to known faces
process_this_frame = True


# Remove face_enc from arr
def remove_from_array(base_array, test_array):
    for index in range(len(base_array)):
        if np.array_equal(base_array[index], test_array):
            base_array.pop(index)
            break

def getFaceSize(location):
    (top, right, bottom, left) = location
    top *= scale
    right *= scale
    bottom *= scale
    left *= scale
    hsize = right-left
    vsize = bottom-top
    avgsize = (hsize+vsize)/2
    return avgsize


def getCamFace():
    ret, frame = video_capture.read()
    return getFace(frame)

def getFace(frame):
    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=1/scale, fy=1/scale)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]

    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    userid = None

    for face_encoding, face_location in zip(face_encodings, face_locations):
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

        size = getFaceSize(face_location)
        if size < min_face_size:
            return

        if(len(known_face_encodings) == 0):
            newFace(face_encoding, frame)
            return

        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            userid = known_face_userids[best_match_index]
        else:
            newFace(face_encoding, frame)
        face_userids.append(userid)

    process_this_frame = True # not process_this_frame

    return userid

# Release handle to the webcam
def newFace(encoding, frame):
    userid = str(uuid.uuid4())
    cv2.imwrite(path.join(facedir, userid+'.jpg'), frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    known_face_encodings.append(encoding)
    known_face_userids.append(userid)


class detectThread (threading.Thread):
    def __init__(self, threadID, name):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.running = False
    def run(self):
        self.running = True
        print("Starting " + self.name)
        faceLoop(self)
        print("Exiting " + self.name)
    def stop(self):
        self.running = False

def faceLoop(thread):
    from main import onFaceDetect
    while thread.running:
        userid = getCamFace()
        onFaceDetect(userid)
        event.wait(2)

def stopDetect():
    video_capture.release()
    cv2.destroyAllWindows()