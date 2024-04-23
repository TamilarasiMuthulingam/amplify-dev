
import React, { useState, useEffect } from "react";

import { mqtt5, auth, iot } from "aws-iot-device-sdk-v2";


const PublishAndSubscribe = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [discoverMessages, setDiscoverMessages] = useState([]);
  const topicToPublish = "discoveryRequest";
  const topicToSubscribe = "discoverState";
  const[mqttClient,setMqttClient]=useState("");
 
  class AWSCognitoCredentialsProvider extends auth.CredentialsProvider {
    constructor(options) {
      super();
      this.options = options;
      this.cachedCredentials = null;
    }
 
  
 
    getCredentials() {
      return {
        aws_access_id: process.env. REACT_APP_ACCESS_KEY_ID,
        aws_secret_key: process.env. REACT_APP_SECRET_ACCESS_KEY,
        aws_sts_token: this.cachedCredentials?.sessionToken,
        aws_region: this.options.Region,
      };
    }
  }
 
  useEffect(() => {
    const initMqttClient = async () => {
      try {
        const provider = new AWSCognitoCredentialsProvider({
          IdentityPoolId: "ap-south-1:d1d9188d-8a65-4d13-bd76-fd51362d9945",
          Region: "ap-south-1",
        });
        await provider.refreshCredentials();
 
        const client = createClient(provider);
        setMqttClient(client);
 
        client.start();
 
        client.on("messageReceived", (eventData) => {
          const newMessage = eventData.message;
          console.log("subscription",newMessage)
          setDiscoverMessages((prevMessages) => [...prevMessages, newMessage]);
        });
 
        client.subscribe({
          subscriptions: [{ topicFilter: topicToSubscribe }],
        });
      } catch (error) {
        console.error("Error initializing MQTT client:", error);
      }
    };
 
    initMqttClient();
 
    return () => {
      if (mqttClient) {
        mqttClient.stop();
          console.log('MQTT client stopped');
      }
    };
  }, []);
 

 
  const createClient = (provider) => {
    let wsConfig = {
      credentialsProvider: provider,
      region: "ap-south-1",
    };
    let builder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
      "a3317ptiejt6p9-ats.iot.ap-south-1.amazonaws.com",
      wsConfig
    );
    let client = new mqtt5.Mqtt5Client(builder.build());

    return client;
  };
 
  const publishToDiscoveryRequest = async () => {
    if (mqttClient) {
      const message = {
        serialNumber,
        name,
        organization,
        address: { city, state, country, postalCode },
      };
      const qos = mqtt5.QoS.AtLeastOnce;
      const payload = JSON.stringify(message);
      const topicName = "discoveryRequest";
 
      const publishResult = await mqttClient.publish({
        qos,
        topicName,
        payload,
      });
      console.log("Publish Result:", publishResult);
    }
  };
 
  return (
    <div className="publish-subscribe">
      <div className="publish">
        <h2 style={{ color: "white", position: "relative", bottom: "20px" }}>
          Publish to {topicToPublish}:
        </h2>
        <div className="container3">
          <div>
            <label>Serial Number:</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
          <div>
            <label style={{ marginRight: "62px" }}>name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ marginRight: "13px" }}>organization:</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>
          <div>
            <label style={{ marginRight: "77px" }}>city:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label style={{ marginRight: "67px" }}>state:</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label style={{ marginRight: "46px" }}>country:</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div>
            <label style={{ marginRight: "19px" }}>postalCode:</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <br />
        </div>
        <button
          style={{ position: "relative", left: "85px" }}
          onClick={publishToDiscoveryRequest}
        >
           Discovery 
        </button>
      </div>

      <div className="subscribe">
        
        <ul>
          {discoverMessages.map((message, index) => (
            <li key={index}>
            <strong>Topic:</strong> {message.topic}, <strong>Payload:</strong> {message.payload}
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublishAndSubscribe;
