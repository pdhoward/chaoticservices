////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             echo and direct                 ///////////
//////////////////////////////////////////////////////////////////
var greeting =  require('greeting');
const request = require('request-promise');

const REDIS_URI='redis-15416.c12.us-east-1-4.ec2.cloud.redislabs.com'
const REDIS_PORT= '15146'

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

// NOTE -- etire interact object is being passed to the microservice

function main(args) {

  console.log("NEW ECHO FUNCTION")

  var text = "product";

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
      respond(args, function(response) {
          let result = {};
          result.sender = 'echo';
          result.orgmessage = args;
          result.reply = []
          result.reply.push(response)
        //  result.reply.push({'link': 'http://www.example.com/'})
          console.log(result.reply)
          resolve(result)
      })
    })
  };

//respond returns a string
function respond(args, cb) {
   let reply = {'msg':'Agent ' + args.agent.name +
                      ' Skill ' + args.agent.skill +
                      ' Iteration ' + args.agent.iterations +
                      ' Message ' + args.message.Body +
                      ' Sender ' + args.intent.response.sender + 
                      ' Response ' + args.intent.response.reply};

   cb(reply)

};


exports.handler = main;
