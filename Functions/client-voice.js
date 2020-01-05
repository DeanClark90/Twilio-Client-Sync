exports.handler = function(context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();
    let functionUrl = "YOUR_TWILIO_DOMAIN.twil.io/status-callback"
    if(event.To) {
      // Wrap the phone number or client name in the appropriate TwiML verb
      // if is a valid phone number;
      const dial = twiml.dial({
        callerId: context.CALLER_ID,
        answerOnBridge: "true"
      });
      dial.number({
      statusCallbackEvent: 'initiated ringing answered completed',
        statusCallback: functionUrl,
        statusCallbackMethod: 'POST'
      }, event.To);
    } else {
      twiml.say('Thanks for calling!');
    }

     callback(null, twiml);
};
