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
            result.reply = response.slice()
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
  let newObj = {}

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
      msg.msg = interactions[0]
      newObj = Object.assign({}, msg)
      response.push(newObj)
      msg.msg = "The state of your inital interaction is " + args.statusInteraction
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
    case 2:
      msg.msg = interactions[3] + args.text
      newObj = Object.assign({}, msg)
      response.push(newObj)
      msg.msg = "Which is brilliant"
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
    //
    case 3:
      msg.msg = interactions[1] + t + " which is a lot of texting"
      response.push(msg)
      cb(response)
      break;
    //
    case 4:
      msg.msg = interactions[2] + args.postdate
      response.push(msg)
      cb(response)
      break;

    default:
      msg.msg = interactions[1] + t
      newObj = Object.assign({}, msg)
      response.push(newObj)
      msg.msg = "When will this discussion end"
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
  }

};


exports.handler = main;
