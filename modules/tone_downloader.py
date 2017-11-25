import json
import os

from tone_analyzer import analyze_emotion

if __name__ == '__main__':
	list_of_poets = os.listdir(os.path.join(os.getcwd(), '../poets'))
	print (list_of_poets)
	list_of_dled_emotions = os.listdir(os.path.join(os.getcwd(), '../emotion_db'))
	print (list_of_dled_emotions)
	to_download = [x in list_of_poets if (x + '.emo') not in list_of_dled_emotions]
	print (to_download)

	for poetry_file in to_download:
		with open(os.path.join(os.getcwd(), '../poets', poetry_file), 'r') as f:
			poetry_list = json.loads(f.read())
			emote_list = []
			for poem in poetry_list:
				text = '\n'.join(poem['lines'])
				tone = analyze_emotion(text)
				poem['tone'] = tone
				emote_list.append(poem)
			with open(os.path.join(os.getcwd(), '../emotion_db', poetry_file + '.emo'), 'w') as wf:
				wf.write(json.dumps(emote_list))
				print('Successfully added {} to emotion db'.format(poetry_file))