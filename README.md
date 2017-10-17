# twilio-serverless-sms-demo
An example of running an Optimizely Full Stack experiment with the Node SDK on a Twilio Programmable SMS service through their Serverless Function capability.

## Tutorial
### Optimizely Project Setup
Set up an Optimizely Full Stack project by following our [getting started guide](https://developers.optimizely.com/x/solutions/sdks/getting-started/index.html?language=node).

### Twilio Runtime Function Configuration
1. Get a Twilio phone number by following Twilio's [getting started guide](https://www.twilio.com/docs/quickstart/node/programmable-sms#get-a-twilio-phone-number).
2. Create a [Twilio Runtime Function ](https://www.twilio.com/docs/quickstart/runtime/programmable-sms#create-a-runtime-function)
3. Go to the [Configure dashboard ](https://www.twilio.com/console/runtime/functions/configure)of Runtime Functions
4. Click `Enable ACCOUNT_SID and 	AUTH_TOKEN` to make initializing Twilio Client easier.
5. Add [`optimizely-server-sdk`](https://github.com/optimizely/node-sdk) as a dependency at `1.4.2` or use the [latest version](https://github.com/optimizely/node-sdk/releases/latest).
6. Add ['request'](https://github.com/request/request) as a dependency at `2.83.0`.
7. Add ['request-promise'](https://github.com/request/request-promise) as a dependency at `4.2.2`.

### Implementing the Twilio Runtime Function
Example implementation can be found in `index.js`.

1. Create a new function from the `Hello SMS` template.
2. Name the twilio function and give it a path.
3. Copy and paste the initialization code for the Optimizely SDK from the "Create an Optimizely Client" section of the [Node getting started guide](https://developers.optimizely.com/x/solutions/sdks/getting-started/index.html?language=node).
4. Grab the incoming message body. `var incomingMessage = event.Body;`
5. Grab the incoming phone number. `var userId = event.From;`
6. Import and initialize a hash object to anonymize phone numbers. 

    ```javascript
	var crypto = require('crypto');
	var md5sum = crypto.createHash('md5');
	var userId = md5sum.update(event.From).digest('hex');
	```

7. Check if the message body is "Hello"
8. Activate the experiment and send back messages of different variations.
9. Check if the message body is "Yes" or "No"
10. Track the responses and thank them for participating.