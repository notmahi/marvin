import json
import os

from tone_analyzer import analyze_emotion

if __name__ == '__main__':
	list_of_files = os.listdir(os.path.join(os.getcwd(), '../poets'))
	print (list_of_files)