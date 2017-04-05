////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             banter and direct                 ///////////
//////////////////////////////////////////////////////////////////
var greeting = require('greeting');
const request = require('request-promise');

const rp = request({
  uri: 'http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en',
  json: true,
  headers: {'User-Agent': 'OpenWhisk'}
})

const errorResponse = [
  'Hmmm. The quote machine is not working. Try again later',
  'This is a surprise. I am out of quotes says the chaoticbot',
  'Oh oh. The Quote bot seems to be offline. Sorry'
]

const triggerWords = [
  'sale',
  'price',
  'pricing',
  'training',
  'website',
  'product',
  'order',
  'buy',
  'ship'
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
  console.log("NEW BANTER FUNCTION")

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

  // compose response or redirect
  return new Promise (function(resolve, reject){
      respond(text, function(response) {
          var result = {};
          result.sender = 'banter';
          result.receiver = undefined;
          result.callback = false;
          result.restart = false;
          result.redirect = {};
          result.orgmessage = undefined;
          result = Object.assign(result, response)
          console.log("DEBUG BANTER RESULT")
          console.log(JSON.stringify(result))
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
      var newAgent = '@sales';
      replyObj.text = 'Banter is redirecting';
      replyObj.redirect = {
        agent: newAgent           
      };
      visit.isTrigger = false;
      cb(replyObj)
    } else {
      replyObj.redirect = {};
    }


    if (text.match(/quote/i)) {
        return rp
          .then(function(res){
            replyObj.text = res;
            cb(replyObj); })
          .catch(function (err) {
            getRandomInt(0, 2, function(x){
              replyObj.text = errorResponse[x];
              cb(replyObj)
            })
        });
    } else {
      var greet = greeting.random()
      replyObj.text = greet + extraText
      cb(replyObj)
  }
};

function getRandomInt(min, max, cb) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    return cb(result);
  }

exports.handler = main;
