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
  count: 1
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

    //////////////////////////////////////////////////////
    //////       Restore Session Variables           ////
    ////////////////////////////////////////////////////

    var req = Object.assign({}, args.system.req);
    var clients =     args.system.clients.slice();
    var text =        args.text;
    visit.greeting =  args.context.redirect.greeting;
    visit.sender =    args.context.redirect.sender;
    visit.receiver =  args.context.redirect.receiver;

// toggle sender and receiver for live session
    if (visit.sender == args.sender) {
      replyObj.togglesender = visit.receiver
    }
    if (visit.receiver == args.sender) {
      replyObj.togglesender = visit.sender
    }

// test for return visit
    if (args.context.redirect.count) {
      visit.isReturn = true,
      visit.count = args.context.redirect.count + 1
       }

// on first time pass back an opening greeting to the original sender
    if (visit.count == 1) {
      visit.text = visit.greeting;
      replyObj.togglesender = visit.sender
    } else {
      visit.text = args.text
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

// respond returns a string. Note that with avatar it redirects to itself,
// so it can toggle receiver and sender and pass itself a visit count
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
      var thisAgent = '@avatar'
      replyObj.redirect = {
          agent: thisAgent,
          sender: visit.sender,
          receiver: visit.receiver,
          count: visit.count
        };
      replyObj.callback = true;
      replyObj.restart = false;
      replyObj.text = visit.text
      cb(replyObj)
    }
  };


exports.handler = main;
