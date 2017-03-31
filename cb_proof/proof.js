////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          sales microservices               ///////////
//////////////////////////////////////////////////////////////////

const proofResponse = [
  'I understand you are looking for a referral. Is that true ',
  'Would you like a referral  ',
  'Would you like to text with one of our product advocates '
]

const triggerWords = [
  'yes',
  'please',
  'absolutely',
  'ok',
  'do it'
]

var visit = {
  isReturn: false,
  isKnown: false,
  isTrigger: false,
  count: 0
}

var replyObj = {
  text: ' ',
  callback: false,
  redirect: false,
  restart: false
}


function main(args) {
  console.log("PROOF FUNCTION")

    ////////////////////////////////////////////////////
    //////  Test Session Variable: New discussion?  ////
    ////////////////////////////////////////////////////

    var req = Object.assign({}, args.system.req);
    var clients = args.system.clients.slice();
    var text = args.text;

    // test for ongoing discussion
    if (req.session.count) {
      visit.isReturn = true,
      visit.count = req.session.count
       }

    // test to see if sender is registered to platform
    var client = clients.find(function( item ) {
       return item.phone == args.sender;
     });

    if (client !== undefined) {
        visit.isKnown = true;
        visit.name =    client.contact;
        visit.company = client.name;
        visit.state =   client.state;
    }

    // test for trigger words which redirect to another bot (microservice)
    var trigger = triggerWords.find(function( item ) {
        return text.match(item);
      });

    if (trigger !== undefined) {
        visit.isTrigger = true;
        visit.trigger = trigger;
    }

  // compose response and determine callback
  return new Promise (function(resolve, reject){
      respond(text, function(response) {
          var result = {};
          result.sender = 'proof';
          result.receiver = undefined;
          result.callback = false;
          result.restart = false;
          result.redirect = false;
          result.orgmessage = undefined;
          result = Object.assign(result, response)
          resolve(result)
      })
    })
  };

  //respond returns a string
  function respond(text, cb) {
//     var response = 'Hi I am your sales rep. How may I help you?'
//     cb(response)
    if (visit.isKnown) {
      var extraText = ' ' + visit.name + ' ?'
    } else {
      var extraText = ' new guy?';
    }

    if (visit.isTrigger) {
      replyObj.text = 'Go ahead and ask your questions. Your party is now online and ready';
      replyObj.redirect = false;
      replyObj.callback = false;
      visit.isTrigger = false;
      cb(replyObj)
    } else {
      replyObj.redirect = false;
      replyObj.callback = true;
      getRandomInt(0, 2, function(x){
        replyObj.text = proofResponse[x] + extraText
        cb(replyObj)
    })
  };
}

function getRandomInt(min, max, cb) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    return cb(result);
  }

exports.handler = main;
