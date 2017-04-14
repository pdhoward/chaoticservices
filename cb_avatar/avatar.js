////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          sales microservices               ///////////
//////////////////////////////////////////////////////////////////

// REFACTOR -- testing using a way to restart dialogue
const triggerWords = [
  'BYE'
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
    visit.greeting = 'Hello. Your party is now online. Please go ahead'

// toggle sender and receiver for live session
    if (args.agentonelive == args.sender) {
      replyObj.togglesender = args.agenttwolive
    }
    if (args.agenttwolive == args.sender) {
      replyObj.togglesender = args.agentonelive
    }

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
          result.intent = 'live';
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
      var extraText = ' ' + visit.name;
  }

  if (visit.isTrigger) {
      replyObj.text = 'ending live session';
      replyObj.redirect = {};
      replyObj.callback = false;
      replyObj.restart = true;
      visit.isTrigger = false;
      visit.trigger = '';
      cb(replyObj)
    }
  else
    {
      replyObj.redirect = {};
      replyObj.callback = true;
      replyObj.restart = false;
      replyObj.text = args.text
      cb(replyObj)
    }
  };


exports.handler = main;
