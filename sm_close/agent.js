////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             echo and direct                 ///////////
//////////////////////////////////////////////////////////////////
var greeting =              require('greeting');
const request =             require('request-promise');
const s =                   require('serialijse')
const {Message} =           require('./constructor')

function main(obj) {

  // refactor this payload approach -- take a look at server code for better way
  let str = obj.payload // pick up the serialized object from payload
  s.declarePersistable(Message)
  let args = s.deserialize(str)
  console.log("--------------micro test ---------------")
  // methods
  console.log(args.sender)
  console.log(args.senderName)
  console.log(args.text)
  console.log(args.sequenceCnt)
  console.log(args.confidence)

  // compose response or redirect
  return new Promise (function(resolve, reject){
          let result = {};
          result.sender = args.sender;

          // must be refactored -- part of constructor for production
          delete args.orgmessage
          result.orgmessage = args;
          ///////////////////////////////////
          result.reply = []

          //
          if (args.confidence < 70) {
            wat(args, (response) => {
              result.reply = response.slice()
              console.log(response)
              console.log(result.reply)
              resolve(result)
            })
          }
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
  let interactions = ["Good bye! From your friends at Strategic Machines"]

  let response = []
  let msg = {
    msg: ""
  }
  let newObj = {}

  let t = args.sequenceCnt
  let v = args.obj.dialogue.sequenceCnt

  msg.msg = interactions[0]
  newObj = Object.assign({}, msg)
  response.push(newObj)

  cb(response)

};
//respond returns a string
function wat(args, cb) {
  let interactions = ["hmmm. I didn't understand that. Please try again", "I am here to talk about toys", "Wat? I am stumped. ", "You said "]
  let response = []
  let msg = {
    msg: ""
  }
  let newObj = {}

  let t = args.sequenceCnt
  let v = args.obj.dialogue.sequenceCnt
  switch(t) {
    case 0:
      msg.msg = "This is interaction " + t + " which seems a little low"
      response.push(msg)
      cb(response)
      break;
    case 1:
      msg.msg = interactions[0]
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
    case 2:
      msg.msg = interactions[3] + args.text
      newObj = Object.assign({}, msg)
      response.push(newObj)
      msg.msg = interactions[1]
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
    //
    case 3:
      msg.msg = "This is interaction " + t + " Ask for my toy catalogue!"
      response.push(msg)
      cb(response)
      break;

    default:
      msg.msg = interactions[2]
      newObj = Object.assign({}, msg)
      response.push(newObj)
      msg.msg = interactions[3] + + args.text
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
  }

};

exports.handler = main;
