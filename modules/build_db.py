import json
import os
from tinydb import TinyDB

EMOTION_DB = os.path.join(os.path.dirname(__file__), '../EmotionDB.json')

if __name__ == '__main__':
    dir = os.path.dirname(__file__)
    list_of_poets = os.listdir(os.path.join(dir, '../emotion_db'))
    identifier = 0
    emotionDB = TinyDB(EMOTION_DB)

    list_of_emotion_files = [os.path.join(dir, '../emotion_db', x) for x in list_of_poets]
    for emo_file in list_of_emotion_files:
        with open(emo_file, 'r') as f:
            list_of_poems = json.load(f)
            for poem in list_of_poems:
                poem['id'] = identifier
                identifier += 1

                poem['tone'] = poem['tone']['document_tone']['tones']

                emotionDB.insert(poem)

                if identifier % 100 == 0:
                    print('Done inserting {}'.format(identifier))
