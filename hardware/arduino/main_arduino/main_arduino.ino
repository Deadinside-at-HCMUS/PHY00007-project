#include <NewPing.h>
#include <ArduinoJson.h>
#include <TimerFreeTone.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_Fingerprint.h>

// led state
#define OFF_LED 0
#define RED_LED 1
#define GREEN_LED 2
#define BLUE_LED 3

// initialize:
// 1. lcd
bool isOn = false;
LiquidCrystal_I2C lcd(0x27,16,2); 

// 2. ultrasonic sensor
const int trigPin = 24;
const int echoPin = 25;
const int maxDistance = 200;
NewPing sonar(trigPin, echoPin, maxDistance);

// 3. fingerprint sensor as608
volatile int finger_status = -1;
SoftwareSerial fpsSerial(50, 51); // TX/RX
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&fpsSerial);

// 4. buzzer
const int buzzerPin = 52;

// 5. led
const int redPin = 7;
const int greenPin = 6;
const int bluePin = 5;

// 6. esp connection with UART transmission
const int rxPin = 11;
const int txPin = 12;
SoftwareSerial uartSerial(rxPin, txPin);

// 7. json data
StaticJsonDocument<200> doc;


// support functions
// changing led state
void turnLed(int led) {
  if (led == RED_LED) { 
    analogWrite(redPin,   255);
    analogWrite(greenPin, 30);
    analogWrite(bluePin,  30);

  } else if (led == GREEN_LED) {
    analogWrite(redPin,   30);
    analogWrite(greenPin, 255);
    analogWrite(bluePin,  30);

  } else if (led == BLUE_LED) {
    analogWrite(redPin,   30);
    analogWrite(greenPin, 30);
    analogWrite(bluePin,  255);

  } else { // led off
    analogWrite(redPin,   0);
    analogWrite(greenPin, 0);
    analogWrite(bluePin,  0);
  }
}

// operating corresponding signal to right/wrong attendance
void attendanceSignal(bool isAccurate) {
  if (isAccurate) {
    lcd.clear();
    lcd.setCursor(3, 0);
    lcd.print("Attending");
    lcd.setCursor(2, 1);
    lcd.print("Successfully!");
    TimerFreeTone(buzzerPin, 500, 50);
    delay(50);
    TimerFreeTone(buzzerPin, 500, 50);
    turnLed(GREEN_LED);
    delay(1000);
    turnLed(BLUE_LED);
  } else {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Attending failed");
    lcd.setCursor(2, 1);
    lcd.print("Try again!");
    TimerFreeTone(buzzerPin, 100, 150);
    turnLed(RED_LED);
    delay(1000);
    turnLed(BLUE_LED);
  }
}

// calculating distance from sensor to obstacle
unsigned int getDistance() {
  delay(50);
  unsigned int uS = sonar.ping();

  if (uS == 0) {
    return maxDistance;
  }

  unsigned int distanceCm = uS / US_ROUNDTRIP_CM;
  return distanceCm;
}

// returns -1 or -2 if failed, otherwise returns fingerprint ID
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != 2) {
    Serial.println(p);
  }
  if (p != FINGERPRINT_OK) return -1;
  
  p = finger.image2Tz();
  if (p != 2) {
    Serial.println(p);
  }
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return -2;
  
  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID); 
  Serial.print(" with confidence of "); Serial.println(finger.confidence);
  return finger.fingerID; 
}

void setup() {
  // lcd setup
  lcd.init();                    
  lcd.backlight();

  // led setup
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // uart communication setup
  uartSerial.begin(115200);

  // fingerprint sensor
  Serial.begin(9600);
  while (!Serial);
  delay(100);
  Serial.println("\n\nAdafruit finger detect test");

  // set the data rate for the sensor serial port
  finger.begin(57600);
  
  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    while (1) { delay(1); }
  }

  finger.getTemplateCount();
  Serial.print("Sensor contains "); Serial.print(finger.templateCount); Serial.println(" templates");
  Serial.println("Waiting for valid finger...");
}

void loop() {
  unsigned int distance = getDistance();

  if (distance < 100) { // if there's person nearby
    if (!isOn) {
      lcd.backlight();
      lcd.setCursor(0, 0);
      lcd.print("Waiting for");
      lcd.setCursor(0, 1);
      lcd.print("finger print...");
      turnLed(BLUE_LED);
      isOn = true;
    }
  } else {
    isOn = false;
    lcd.clear();
    lcd.noBacklight();
    turnLed(OFF_LED);
  }

  // get input fingerprint ID
  finger_status = getFingerprintIDez();
  if (finger_status != -1 && finger_status != -2){ // if have found fingerprint ID
    Serial.print("Match\n");
    attendanceSignal(true);

    String data = "Attendance ID: " + (String)(finger_status);
    Serial.println(data);

    // Assign information to JsonDocument object
    doc["Content"] = "Attendance";
    doc["ID"] = finger_status;
    doc["Course"] = "Physics for IT - 21CLC02";
    doc["Week"] = 10;

    // Converting JsonDocument object to JSON string and send to esp
    serializeJson(doc, uartSerial);
    uartSerial.println();

    // Converting JsonDocument object to JSON string and printing through Serial monitor
    serializeJson(doc, Serial);
    Serial.println();

    delay(1000);

  } else if (finger_status == -2) { // if have not found fingerprint ID
    Serial.print("Not Match\n");
    attendanceSignal(false);
  }
}