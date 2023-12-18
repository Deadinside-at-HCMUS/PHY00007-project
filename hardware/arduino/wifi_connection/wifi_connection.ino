#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>

// initialize
// wiFi
const char *ssid = "Tuhuynhh"; // wiFi name
const char *password = "thuongtuthien";  // wiFi password
WiFiClient espClient;
PubSubClient client(espClient);

// MQTT Broker
const char *mqtt_broker = "broker.emqx.io";
const char *topic = "esp8266/smartAttendance";
const char *mqtt_username = "group02_sma"; // username for authentication
const char *mqtt_password = "21clc_iot"; // password for authentication
const int mqtt_port = 1883;

// UART transmission
SoftwareSerial uartSerial(D2, D1); 

// json data
StaticJsonDocument<200> doc;

void connectWifi() {
  // connect to wiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  for (int i = 0; i < length; i++) {
      Serial.print((char) payload[i]);
  }
  Serial.println();
  Serial.println("-----------------------");
}

void connectMQTT() {
  // connect to mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  while (!client.connected()) {
      String client_id = "esp8266-client-";
      client_id += String(WiFi.macAddress());
      // Serial.printf("The client %s connects to the public mqtt broker\n", client_id.c_str());
      if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
          Serial.println("Public emqx mqtt broker connected");
      } else {
          Serial.print("failed with state ");
          Serial.print(client.state());
          delay(2000);
      }
  }
}

void setup() {
  uartSerial.begin(115200);

  Serial.begin(9600);

  connectWifi();
  
  connectMQTT();

  // publish and subscribe, checking connection
  const char* welcome_message = "{\"Content\":\"Welcome message!\", \"ID\":-1}";
  client.publish(topic, welcome_message);
  client.subscribe(topic);
}



void loop() {
  client.loop();

  if (uartSerial.available()) { // If there's data from Mega
    // Read data string
    String data = uartSerial.readStringUntil('\n');

    // convert JSON string to JsonDocument object
    DeserializationError error = deserializeJson(doc, data);

    // Check if there's error in coverting stage
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }

    // Take ID from JsonDocument object and print to Serial monitor
    int id = doc["ID"];
    Serial.print("Attendance ID: ");
    Serial.println(id);

    // publish attendance data to mqtt broker
    const char* publishData = data.c_str();
    client.publish(topic, publishData);

    delay(1000);
  }

}