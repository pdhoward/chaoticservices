////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             echo and direct                 ///////////
//////////////////////////////////////////////////////////////////
var greeting =              require('greeting');
const request =             require('request-promise');
const s =                   require('serialijse')
const {Message} =           require('./constructor')

function main(obj) {
  let str = obj.payload // pick up the serialized object from payload
  s.declarePersistable(Message)
  let args = s.deserialize(str)
  console.log("--------------micro test ---------------")
  console.log(args.sender)
  console.log(args.text)
  console.log(args.sequenceCnt)
  console.log(args.postdate)
  console.log(args.statusInteraction)

  // compose response or redirect
  return new Promise (function(resolve, reject){
          let result = {};
          result.sender = args.sender;

          // must be refactored -- part of constructor for production
          delete args.orgmessage
          result.orgmessage = args;
          ///////////////////////////////////
          result.reply = []
          respond(args, (response) => {
            result.reply.concat(response)
            console.log(response)
            console.log(result.reply)
            resolve(result)
          })

        //  result.reply.push({'link': 'http://www.example.com/'})

    })
  };

//respond returns a string
function respond(args, cb) {
  let interactions = ["Hey, I see this is your first text", "This is text number ", "Todays date is ", "You said "]
  let response = []
  let msg = {
    msg: ""
  }

  let t = args.sequenceCnt
  console.log("inside of case switch")
  console.log(t)
  console.log(typeof t)
  let v = args.obj.dialogue.sequenceCnt
  console.log(v)
  console.log(typeof v)
  switch(t) {
    case 0:
      msg.msg = interactions[1] + t + " which seems a little low"
      response.push(msg)
      cb(response)
      break;
    case 1:
      msg.msg = interactions[2] + args.postdate
      response.push(msg)
      cb(response)
      break;
    case 2:
      msg.msg = interactions[3] + args.text
      response.push(msg)
      msg.msg = "Which is brilliant"
      response.push(msg)
      cb(response)
      break;

    default:
      msg.msg = interactions[1] + t
      response.push(msg)
      msg.msg = "When will this discussion end"
      response.push(msg)
      cb(response)
      break;
  }

};


exports.handler = main;
