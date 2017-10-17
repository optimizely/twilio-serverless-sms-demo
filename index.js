exports.handler = function(context, event, callback) {
  var crypto = require('crypto');
  var md5sum = crypto.createHash('md5');

  var url = 'https://cdn.optimizely.com/json/9031615370.json';
  var rp = require('request-promise');
  var options = {uri: url, json: true};
  var optimizelySDK = require('optimizely-server-sdk');
  var optimizely;
  rp(options).then(function(datafile) {
    optimizely= optimizelySDK.createInstance({datafile: datafile});
    let twiml = new Twilio.twiml.MessagingResponse();

    var incomingMessage = event.Body;
    var userId = md5sum.update(event.From).digest('hex');

    if (incomingMessage.toLowerCase() == 'hello') {
      var variationKey = optimizely.activate('basic_experiment', userId);

      if (variationKey == 'A') {
        // execute code for A
        twiml.message('Are you interested in learning more about Optimizely Full Stack?');
      }
      else if (variationKey == 'B') {
        // execute code for B
        twiml.message('Want to learn how to experiment easily with Optimizely Full Stack? Reply ‘YES’ for a guide to best practices!');
      }
      else {
        // execute default code
        twiml.message('Reply "YES" to learn more about Optimizely Full Stack!')
      }
    }
    else if (incomingMessage.toLowerCase() == 'yes') {
      optimizely.track('positiveResponse', userId);
      twiml.message('Thanks for responding! Check out Full Stack here. https://www.optimizely.com/products/full-stack/');
    }
    else if (incomingMessage.toLowerCase() == 'no') {
      optimizely.track('negativeResponse', userId);
      twiml.message('Are you sure? This is what CROmetrics has to say about Optimizely Full Stack. https://crometrics.com/optimizely-full-stack/');
    }
    else {
      twiml.message('Hi!');
    }
    callback(null, twiml);
  });
};
