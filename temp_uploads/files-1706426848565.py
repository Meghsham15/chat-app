import pyttsx3
import datetime
import speech_recognition as sr

engine = pyttsx3.init()

# Audio output - 
def speak(audio):
    engine.say(audio)
    engine.runAndWait()


# Taking voice input with voice recognition - 
def takeCommand():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening")
        r.pause_threshold = 1
        audio = r.listen(source)
    
    try:
        print("Recognizing")
        query = r.recognize_google(audio, language = 'en-in')
        print(query)
    except Exception as e:
        print(e)
        speak("say that again please ....")
        return "none"
    
    return query


takeCommand()