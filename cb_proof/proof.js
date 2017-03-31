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
  'do it',
  'Yes',
  'Please',
  'Absolutely',
  'Ok',
  'Go',
  'Do'
]

var visit = {
  isReturn: false,
  isKnown: false,
  isTrigger: false,
  isProof: false,
  activeProof: false,
  count: 0
}

var replyObj = {
  text: ' ',
  callback: false,
  redirect: false,
  restart: false
}

var proofAgent = {
  live: '+19145271623'
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

    // test for ongoing discussion
    if (req.session.count) {
      visit.isReturn = true,
      visit.count = req.session.count
       }
// set for request for active session
    if (args.context) {
        if (args.context.proof) {
          visit.isProof = true
        } else {
          visit.isProof = false
        }
      }
// set for active session
    if (args.context) {
        if (args.context.activeProof) {
            visit.activeProof = true
        } else {
          visit.activeProof = false
        }
      }
// record number of sender
    visit.sender = args.sender

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
      respond(args, function(response) {
          var result = {};
          result.sender = 'proof';
          result.receiver = undefined;
          result.callback = false;
          result.restart = false;
          result.redirect = false;
          result.proof = false;
          result.orgmessage = undefined;
          result = Object.assign(result, response)
          resolve(result)
      })
    })
  };

  //respond returns a string
  function respond(args, cb) {
//     var response = 'Hi I am your sales rep. How may I help you?'
//     cb(response)
    if (visit.isKnown) {
      var extraText = ' ' + visit.name + ' ?'
    } else {
      var extraText = ' new guy?';
    }

    if (visit.isProof) {
      replyObj.text = args.text;  // pass through text from sender
      replyObj.redirect = false;
      replyObj.callback = true;
      replyObj.proof = false;     // proof set to true up on trigger. Now that exchange has started ...
      replyObj.activeProof = true; // ..... set to true to indicate that active exchange has commenced
      replyObj.saveProofSender = visit.sender; // save sender for logic to toogle interchange
      replyObj.saveProofAgent = proofAgent.live;  // agent selected for interchange
      replyObj.sender = proofAgent.live  // kicksoff discussion with first text sent to human agent from sender
      visit.isTrigger = false;
      cb(replyObj)
    }

    if (visit.activeProof) {
      replyObj.text = args.text;  // pass through text from sender
      replyObj.redirect = false;
      replyObj.callback = true;
      replyObj.proof = false;
      replyObj.activeProof = true; // active exchange in progress

      // toggle recipients
      if (visit.sender == args.context.saveProofSender) {
        replyObj.sender = args.context.saveProofAgent
      } else {
        replyObj.sender = args.context.saveProofSender
      }

      visit.isTrigger = false;
      cb(replyObj)
    }

    if (visit.isTrigger) {
      replyObj.text = 'Go ahead and ask your questions. Your party is now online and ready. Enter ! to end session';
      replyObj.redirect = false;
      replyObj.callback = true;
      replyObj.proof = true;     // set proof to true and being passing messages to designated agent
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
