exports.handler = function(context, event, callback) {
  // import libraries
  var crypto = require('crypto');
  var md5sum = crypto.createHash('md5');
  var optimizelySDK = require('optimizely-server-sdk');
  var rp = require('request-promise');

  // datafile URL
  var url = 'https://cdn.optimizely.com/json/9106060316.json';
  var options = {uri: url, json: true};
  var optimizely;

  // get the datafile
  rp(options).then(function(datafile) {

    // initialize Optimizely SDK
    optimizely = optimizelySDK.createInstance({datafile: datafile});

    // Create Twilio response message
    let twiml = new Twilio.twiml.MessagingResponse();

    // get incoming message text
    var incomingMessage = event.Body;

    // get incoming message number
    var userId = md5sum.update(event.From).digest('hex');

    // assume that if a user is saying 'hello' they are just starting
    if (incomingMessage.toLowerCase() === 'hello') {
      // activate the Optimizely Experiment
      var variationKey = optimizely.activate('Twilio_SMS_Experiment', userId);
      // split logic based on which variation the user is in
      if (variationKey === 'A') {
        // execute code for A
        twiml.message('Are you interested in learning more about Optimizely Full Stack?');
      } else if (variationKey === 'B') {
        // execute code for B
        twiml.message('Want to learn how to experiment easily with Optimizely Full Stack? Reply "YES" to learn more!');
      } else {
        // execute default code as fallback
        twiml.message('Reply "YES" to learn more about Optimizely Full Stack!')
      }
    }
    // otherwise track user responses
    else if (incomingMessage.toLowerCase() === 'yes') {
      optimizely.track('Positive Response', userId);
      twiml.message('Thanks for responding! Check out Full Stack here. https://www.optimizely.com/products/full-stack/');
    }
    else if (incomingMessage.toLowerCase() === 'no') {
      optimizely.track('Negative Response', userId);
      twiml.message('Here is a list of all our product announcements at Opticon 2017. https://blog.optimizely.com/2017/10/18/opticon-2017-announcements/');
    }
    // if the user sent a message we cannot respond to, send them the Opticon 2017 recap
    else {
      twiml.message('Watch the Opticon 2017 Keynote for a full recap! https://www.optimizely.com/opticon/');
    }
    // send the message response
    callback(null, twiml);
  });
};
