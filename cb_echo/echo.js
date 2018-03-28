////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             echo and direct                 ///////////
//////////////////////////////////////////////////////////////////
var greeting =              require('greeting');
const request =             require('request-promise');

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

  console.log(">>>>>>>>>>>>>MEGATESTS<<<<<<<<<<<<<<<<")
  //coming soon


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

          // must be refactored -- part of constructor for production
          delete args.orgmessage

          ////////////////////////////////////////////////////////////////////////
          // MORE FUTURES -- DYNAMIC ROUTING
          // name a machine and state to execute n next click or immediately before return
          result.machine = {}
          result.status = {}
          result.machine.name = "testing echo "

          // setting key status flags which drives routing -- on next click
          result.status.isNewInteraction = false
          result.status.isCallback = false
          result.status.isTerminated = false
          result.status.isError = false
          result.status.isAuthenticated = false
          result.status.isAuthorized = false
          result.status.ErrorMsg = {msg: "no error - testing echo"}
          //////////////////////////////////////////////////////////////////////////

          result.orgmessage = args;
          result.reply = []
          result.reply.push(response)
          let msg2 = {}
          let nextSlot = args.machine.thisSlot + 1
          if (nextSlot == args.agent.skills.length) {
              msg2 = {"msg2":' Message ' + args.message.Body + ' This agent has nothing more to say' }
            } else {
              msg2 = {"msg2":' Message ' + args.message.Body + ' Next Skill ' + args.agent.skills[nextSlot].skillname}
            }
          result.reply.push(msg2)
        //  result.reply.push({'link': 'http://www.example.com/'})
          console.log(result.reply)
          resolve(result)
      })
    })
  };

//respond returns a string
function respond(args, cb) {
  let i = args.machine.thisSlot
   let reply = {'msg':'Agent ' + args.agent.name + ' Skill ' + args.agent.skills[i].skillname + ' Iteration ' + args.dialogue.sequenceCnt}

   cb(reply)

};


exports.handler = main;
