////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          sales microservices               ///////////
//////////////////////////////////////////////////////////////////

const avatarResponse = [
  'I am the avatar ',
  'I am the avataer here to set up live sessions  ',
  'Let us start your live session  '
]


// REFACTOR -- testing using a way to restart dialogue
const triggerWords = [
  'Yes',
  'yes'
]


// REFACTOR - select proofagent based on criteria
var visit = {
  isReturn: false,
  isKnown: false,
  isTrigger: false,
  count: 0
}

var replyObj = {
  callback: false,
  redirect: {},
  restart: false
}


function main(args) {
  console.log("AVATAR FUNCTION")

  Object.getOwnPropertyNames(args).forEach(
        function (val, idx, array) {
            if ((val !== 'system') && (val !== 'handler')) {
                  console.log(val + ' -> ' + args[val]); }
            if (val == 'context') {
                  console.log(val + ' -> ' + JSON.stringify(args[val])); }
            if (val == 'bot') {
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
//    visit.agent = args.context.redirect.agent
//    visit.sender = args.context.redirect.sender
//    visit.receiver - args.context.redirect.receiver


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

// DEBUG MODE
  console.log ({visit: JSON.stringify(visit)})

// compose response and determine callback
  return new Promise (function(resolve, reject){
      respond(args, function(response) {
          var result = {};
          result.sender = 'avatar';
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
//     var response = 'Hi I am your sales rep. How may I help you?'
//     cb(response)
    if (visit.isKnown) {
      var extraText = ' ' + visit.name + ' ?'
    } else {
      var extraText = ' new guy?';
    }

    if (visit.isTrigger) {

        replyObj.text = 'ending live session';
        replyObj.redirect = {
            agent: undefined,
            sender: undefined,
            receiver: undefined,
            greeting: ''
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
