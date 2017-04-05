////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////          sales microservices               ///////////
//////////////////////////////////////////////////////////////////

const salesResponse = [
  'I am your sales rep. How can I help ',
  'I can help with that. I am your sales rep ',
  'Sounds like you need help from the sales rep '
]

const triggerWords = [
  'proof',
  'prove',
  'testimony',
  'reference',
  'references'
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
  redirect: {},
  restart: false
}


function main(args) {
  console.log("SALES FUNCTION")

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
          result.sender = 'sales';
          result.intent = 'buy';
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
  function respond(text, cb) {
    if (visit.isKnown) {
      var extraText = ' ' + visit.name
    } else {
      var extraText = ' new guy';
    }

    if (visit.isTrigger) {
      var newAgent = '@proof'
      replyObj.text = 'This is Sales bot redirecting';
      replyObj.redirect = {
        agent: newAgent      
      };
      replyObj.callback = false;
      visit.isTrigger = false;
      cb(replyObj)
      }
      else {
      replyObj.redirect = {};
      replyObj.callback = true;
      getRandomInt(0, 2, function(x) {
        replyObj.text = salesResponse[x] + extraText
        cb(replyObj)
      })
   };
}

function getRandomInt(min, max, cb) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    return cb(result);
  }

exports.handler = main;
