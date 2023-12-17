#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>

// WiFi
// const char *ssid = "hwangdeokthienOnPhone"; // Enter your WiFi name
// const char *password = "smartAttendance";  // Enter WiFi password
const char *ssid = "Tuhuynhh"; // Enter your WiFi name
const char *password = "thuongtuthien";  // Enter WiFi password
WiFiClient espClient;
PubSubClient client(espClient);

// MQTT Broker
const char *mqtt_broker = "broker.emqx.io"; // broker address
const char *topic = "esp8266/smartAttendance"; // define topic 
const char *mqtt_username = "group02_sma"; // username for authentication
const char *mqtt_password = "21clc_iot"; // password for authentication
const int mqtt_port = 1883; // port of MQTT over TCP

// UART transmission
SoftwareSerial uartSerial(D2, D1); 

// json data
StaticJsonDocument<200> doc;

void connectWifi() {
  // connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}

void connectMQTT() {
  //connecting to a mqtt broker
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

void callback(char *topic, byte *payload, unsigned int length) {
  // Serial.print("Message arrived in topic: ");
  // Serial.println(topic);
  // Serial.print("Message: ");
  // for (int i = 0; i < length; i++) {
  //     Serial.print((char) payload[i]);
  // }
  // Serial.println();
  // Serial.println("-----------------------");
}

void setup() {
  uartSerial.begin(115200);

  // Set software serial baud to 9600;
  Serial.begin(9600);

  connectWifi();
  
  connectMQTT();

  // publish and subscribe
  const char* welcome_message = "{\"Content\":\"Welcome message!\", \"ID\":-1}";
  client.publish(topic, welcome_message); // publish to the topic
  client.subscribe(topic); // subscribe from the topic
}



void loop() {
  client.loop();

  if (uartSerial.available()) { // Nếu có dữ liệu từ cổng nối tiếp mềm
    String data = uartSerial.readStringUntil('\n'); // Đọc chuỗi dữ liệu

    // Chuyển đổi chuỗi JSON thành đối tượng JsonDocument
    DeserializationError error = deserializeJson(doc, data);

    // Kiểm tra xem có lỗi nào trong quá trình chuyển đổi hay không
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }

    // Lấy ID từ đối tượng JsonDocument
    int id = doc["ID"];

    // In các giá trị ra màn hình nối tiếp
    Serial.print("Attendance ID: ");
    Serial.println(id);

    const char* publishData = data.c_str();
    client.publish(topic, publishData); // publish to the topic

    delay(1000);
  }

}