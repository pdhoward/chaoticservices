////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          sales microservices               ///////////
//////////////////////////////////////////////////////////////////

function main(args) {
  console.log("SHIPPING FUNCTION")
  var text = args.text;
    return new Promise (function(resolve, reject){
      respond(text, function(response) {
          var result = {};
          result.sender = 'Shipper';
          result.receiver = undefined;
          result.callback = true;
          result.restart = false;
          result.redirect = false;
          result.orgmessage = undefined;
          result.text = response;
          resolve(result)
      })
    })
  };

  //respond returns a string
  function respond(text, cb) {
     var response = 'Hi I am your sales rep. How may I help you?'
     cb(response)
  };

exports.handler = main;
