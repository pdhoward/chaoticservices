////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          shipping microservices               ///////////
//////////////////////////////////////////////////////////////////

function main(args) {
  console.log("SHIPPING FUNCTION")
  var text = args.text;

    return new Promise (function(resolve, reject){
      respond(text, function(response) {
          var result = {};
          result.sender = 'Shipper';
          result.intent = intent;
          result.receiver = undefined;
          result.callback = false;
          result.restart = false;
          result.redirect = false;
          result.orgmessage = undefined;
          result.handle = undefined;
          result.text = response;
          resolve(result)
      })
    })
  };

  //classify returns an array of intents with confidence intervals.
  function respond(text, cb) {
     var response = 'Hi I am the Shipping Agent. I can handle your request'
     cb(response)
  };

exports.handler = main;
