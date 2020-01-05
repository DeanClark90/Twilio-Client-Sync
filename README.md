# Twilio-Client-Sync
For details on setting up the Twilio Client SDK, please check out the quickstart guide: https://www.twilio.com/docs/voice/client/javascript/quickstart 

## Info
This sample project outlines how to sync the call status information for the inbound and outbound call legs using the Twilio Sync SDK. If you aren't familiar with the Twilio client SDK, when initiating a call there will typically be two distinct call legs.

* The first from the Client to Twilio.
* The second from Twilio to the PSTN, SIP Domain or another Client.

## Getting Started with the Sync SDK
The first thing to do is to grab all the necessary information from your Twilio account. To set up your Sync token generator, we will need the following:

* Account SID: Your primary Twilio account identifier - find this [on the main page of the Twilio console.](https://www.twilio.com/console)
* API Key: Used to sign tokens. [Generate one using the console API Keys tool.](https://www.twilio.com/console/sync/tools)
* API Secret: Used to sign tokens, together with the corresponding API Key.
* Sync Service SID: Used to identify the sync service, for this app I used the default sync service - find this [on the Sync Services Dashboard in the console](https://www.twilio.com/console/sync/services) 

These details will be used to generate the Sync tokens, for Twilio's guide on creating tokens, please check [here.](https://www.twilio.com/docs/sync/identity-and-access-tokens)

For my testing, I used a Twilio V1 Function to handle the Access Token creation. Twilio provides a Function template for creating the Sync Access tokens which can be selected when creating a new function via the console. [Functions console](https://www.twilio.com/console/functions/manage)

![Sync function screenshot 1](https://pink-meerkat-1985.twil.io/assets/Screen%20Shot%202020-01-05%20at%209.11.50%20PM.png)

![Sync function screenshot 2](https://pink-meerkat-1985.twil.io/assets/Screen%20Shot%202020-01-05%20at%209.10.15%20PM.png)

## Setting up App.js
Open the app.js file and update the syncTokenUrl, clientTokenUrl and run the application. Once the Client is ready, the Sync Map is created, and an event listener registered. 

## Deploy Function
I have deployed a function that listens for the status callback events for the outbound call leg and updates the Sync Map via the API. The code can be found in the Functions directory.

From within your <Number>/<Client> TwiML, please ensure you add the callback URL and appropriate events. I have provided an example of the function I am using in the Functions directory.

At the moment, the app is merely logging the call details to the console.

![Console output](https://pink-meerkat-1985.twil.io/assets/Screen%20Shot%202020-01-05%20at%209.44.55%20PM.png)
