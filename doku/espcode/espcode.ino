#include "SoundData.h"
#include "XT_DAC_Audio.h"

XT_Wav_Class ForceWithYou(dbus);    
XT_DAC_Audio_Class DacAudio(25,0);    
uint32_t DemoCounter=0;               
int pin = 18; 
int playCounter = 0;
bool flag = false;
bool prevState = HIGH; //LOW

void setup() {
  Serial.begin(115200);
  pinMode(pin, INPUT);
}

void loop() {
  DacAudio.FillBuffer();               
  if(ForceWithYou.Playing==false) {     
    if (digitalRead(pin) == LOW && playCounter < 2 && prevState == HIGH) { //LOW; HIGH
      DacAudio.Play(&ForceWithYou);
      playCounter++;
    } else if (playCounter >= 2) {
      playCounter = 0;
    }
  }
  prevState = digitalRead(pin);
  Serial.println(DemoCounter++);        
}
