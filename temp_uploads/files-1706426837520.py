import pyttsx3
import datetime
import speech_recognition as sr
import wikipedia
import smtplib
import webbrowser as wb
import os
import pyautogui
import psutil
import pyjokes
engine = pyttsx3.init()



def speak(audio):
    engine.say(audio)
    engine.runAndWait()

def time():
    Time = datetime.datetime.now().strftime("%I:%M:%S")
    speak("Current Time is ")
    speak(Time)

# time()

def date():
    year = int(datetime.datetime.now().year)
    month = int(datetime.datetime.now().month)
    day = int(datetime.datetime.now().day)
    speak("Todays Date is ")
    speak(day)
    speak(month)
    speak(year)


def wishme():
    Time = datetime.datetime.now().hour
    if(Time>=0 and Time<5):
        speak("good night")
    elif(Time>=5 and Time<12):
        speak("good morning")
    elif(Time>=12 and Time<16):
        speak("good afternoon")
    elif(Time>=16 and Time<20):
        speak("good evening")
    elif(Time>=20 and Time<24):
        speak("good night")

    
    # time()
    
    # date()
    speak("Welcome back! Jarvis here. How may I help you?")


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

def sendEmail(to,content):
    server = smtplib.SMTP("smtp.gmail.com",587)
    server.ehlo()
    server.starttls()
    server.login("insaneboimj123@gmail.com","Megh$h@m50")
    server.sendmail("insaneboimj123@gmail.com",to,content)
    server.close()

def screenShot():
    img = pyautogui.screenshot()
    img.save("C:\\Users\\HP\\Desktop\\python\\ss.png")

def cpu():
    usage = str(psutil.cpu_percent())
    speak("cpu is at"+usage)
    battery = psutil.sensors_battery()
    speak("battery percent is ")
    speak(battery.percent)

def tellJoke():
    speak("Here is a joke")
    speak(pyjokes.get_joke())

if __name__ =="__main__":
    wishme()
    while True:
        query = takeCommand().lower()
        
        if "time" in query:
            time()
        elif "date" in query:
            date()
        elif "offline" in query:
            speak("shutting down .......")
            quit()
        elif "wikipedia" in query:
            speak("searching")
            query = query.replace("wikipedia", "")
            result = wikipedia.summary(query,sentences = 2)
            print(result)
            speak(result)
        elif "send email" in query:
            try:
                speak("to whom do you want to send ?")
                to = "meghshamjade50@gmail.com"
                speak("what do you want to send ?")
                content = takeCommand()
                sendEmail(to,content)
                speak("email has been sent ")
            except Exception as e:
                print(e)
                speak("unable to send the mail")
        elif "search" in query:
            speak("what should i search")
            chromepath = "C:\Program Files\Google\Chrome\Application\chrome.exe %s" 
            search = takeCommand().lower()
            wb.get(chromepath).open_new_tab(search+".com")
        elif "log out" in query:
            speak("shutting down the system")
            os.system("shutdown -1")
        elif "restart" in query:
            speak("restarting the system")
            os.system("shutdown /r /t 1")
        elif "shutdown" in query:
            speak("logging out the system")
            os.system("shutdown /s /t 1")
        elif "play songs" in query:
            songs_dir = "D:\movies"
            songs = os.listdir(songs_dir)
            os.startfile(os.path.join(songs_dir,songs[0]))
        elif "remember" in query:
            speak("What should I remember?")
            data = takeCommand()
            speak("you said to remember that "+data)
            remember = open('data.txt','w')
            remember.write(data)
            remember.close()
        elif 'do you know anything' in query:
            remember = open("data.txt",'r')
            speak("you said me to remember"+remember.read())
        elif "screenshot" in query:
            screenShot()
            speak("screenshot taken")
        elif "battery" in query:
            cpu()
        elif "joke" in query:
            tellJoke()
