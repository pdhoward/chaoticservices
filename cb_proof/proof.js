////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          sales microservices               ///////////
//////////////////////////////////////////////////////////////////

const proofResponse = [
  'I understand you are looking for a referral. Is that true ',
  'Would you like a referral ',
  'Would you like to text with one of our product advocates '
]

const triggerWords = [
  'yes',
  'please',
  'absolutely',
  'ok',
  'do it',
  'Yes',
  'Please',
  'Absolutely',
  'Ok',
  'Go',
  'Do'
]

var proofAgent = {
  live: '+19145271623'
}

// REFACTOR - select proofagent based on criteria
var visit = {
  sender: '',
  receiver: proofAgent.live,
  isReturn: false,
  isKnown: false,
  isTrigger: false,
  count: 0
}

var replyObj = {
  text: ' ',
  callback: false,
  redirect: {},
  restart: false
}


function main(args) {
  console.log("PROOF FUNCTION")

  Object.getOwnPropertyNames(args).forEach(
        function (val, idx, array) {
            if ((val !== 'system') && (val !== 'handler')) {
                  console.log(val + ' -> ' + args[val]); }
            if (val == 'context') {
                  console.log(val + ' -> ' + JSON.stringify(args[val])); }
                }
            );

    ////////////////////////////////////////////////////
    //////  Test Session Variable: New discussion?  ////
    ////////////////////////////////////////////////////

    var req = Object.assign({}, args.system.req);
    var clients = args.system.clients.slice();
    var text = args.text;
    // record number of sender
    visit.sender = args.sender

// test for ongoing dialogue
    if (req.session.count) {
      visit.isReturn = true,
      visit.count = req.session.count
       }

// test to see if sender is registered to platform
    var client = clients.find(function( item ) {
       return item.phone == visit.sender;
    });

  if (client !== undefined) {
      visit.isKnown = true;
      visit.name =    client.contact;
      visit.company = client.name;
      visit.state =   client.state;
    }

// test for trigger words which redirect to another bot for live chat (microservice)
    var trigger = triggerWords.find(function( item ) {
        return text.match(item);
      });

  if (trigger !== undefined) {
      visit.isTrigger = true;
      visit.trigger = trigger;
    }

  // compose response and determine callback
  return new Promise (function(resolve, reject){
      respond(args, function(response) {
          var result = {};
          result.sender = 'proof';
          result.receiver = undefined;
          result.callback = false;
          result.restart = false;
          result.redirect = {};
          result.orgmessage = undefined;
          result = Object.assign(result, response)
          resolve(result)
      })
    })
  };

  //respond returns a string
  function respond(args, cb) {
    if (visit.isKnown) {
      var extraText = ' ' + visit.name + '?'
    } else {
      var extraText = ' new guy?';
    }

    if (visit.isTrigger) {
        var newAgent = '@avatar'
        replyObj.text = 'Proof bot redirecting to an avatar';
        replyObj.redirect = {
            agent: newAgent,
            sender: visit.sender,
            receiver: visit.receiver,
            greeting: 'Our product advocate is online. Go ahead and ask your question. Enter BYE to end the session'
          };
        replyObj.callback = false;
        visit.isTrigger = false;
        visit.trigger = '';
        cb(replyObj)
      }
    else
      {
        replyObj.redirect = {};
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
