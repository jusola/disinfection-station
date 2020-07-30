import pygame
import pygame.freetype
import os
import random

from config import config

fontsize = 48
padding = 20

pygame.init()
#infoObject = pygame.display.Info()
#dw = infoObject.current_w
#dh = infoObject.current_h

dw = 1920
dh = 1080

w = int(dw*0.33)
h = padding*3+fontsize*2

x = dw - w
y = dh - h



code = None

os.environ['SDL_VIDEO_WINDOW_POS'] = "%d,%d" % (x,y)

screen = pygame.display.set_mode((w, h), pygame.NOFRAME)
GAME_FONT = pygame.freetype.SysFont("Verdana", fontsize)

def runDisplay():
    global code
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            thread.stop()

    screen.fill((255,255,255))
    GAME_FONT.render_to(screen, (padding, padding), "Location: "+config['net']['location'], (0, 0, 0))
    if(code):
        GAME_FONT.render_to(screen, (padding, 2*padding+fontsize), "Code: "+str(code), (0, 0, 0))
    pygame.display.flip()

def quitDisplay():
    pygame.quit()

def showCode(newCode):
    global code
    print(newCode)
    code = newCode
    print(code)

def hideCode():
    global code
    code = None
