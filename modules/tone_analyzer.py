import json
from watson_developer_cloud import ToneAnalyzerV3
from secrets import SECRET_USERNAME, SECRET_PASSWORD

def analyze_emotion(text):
    tone_analyzer = ToneAnalyzerV3(
                        version='2017-09-21',
                        username=SECRET_USERNAME,
                        password=SECRET_PASSWORD,
                    )
    tone = tone_analyzer.tone(text, tones='emotion', content_type='text/plain', charset='utf-8')
    return tone

if __name__ == '__main__':
    print(analyze_emotion("Everything changes, but nothing is truly lost."))
