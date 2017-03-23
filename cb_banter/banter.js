////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          shipping microservices               ///////////
//////////////////////////////////////////////////////////////////

function main(args) {
  console.log("BANTER")
  var text = args.text;
    return new Promise (function(resolve, reject){
      respond(text, function(response) {
          var result = {};
          result.sender = 'Banter';
          result.receiver = undefined;
          result.callback = false;
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
     var response = 'Yo! I am the Banter Bot'
     cb(response)
  };

exports.handler = main;
