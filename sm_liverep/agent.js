////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             echo and direct                 ///////////
//////////////////////////////////////////////////////////////////
const greeting =              require('greeting');
const request =               require('request-promise');
const {machine} =             require('./constructor')

function main(obj) {

  // compose response or redirect
  return new Promise (function(resolve, reject){
          let result = {};
          console.log("---------Banter----------")
          machine()
            .then((o) => {
              // active the object with data
              o.updateWorkObj(obj)
              // grab a copy of the validated data object
              let args = o.getWorkObj()
              // begin to construct the response object
              result.sender = args.message.From
              result.orgmessage = args
              // get the agent response
              result.reply = []

              wat(args, (response) => {
                  result.reply = response.slice()
                  console.log(result)
                  //o.setAgentReply(result)
                  //let newObj = o.getWorkObj()
                  resolve(result)
                  //return
              })

            })
             .catch((e) => {
                console.log("Experiment failed")
                console.log(e)
                reject(e)
          })
        //  result.reply.push({'link': 'http://www.example.com/'})
    })
  }

//respond returns a string
function respond(args, cb) {
  let interactions = ["Hey, great to hear from you ",
                      "This is text number ",
                      "Todays date is ",
                      "You said ",
                      "I am here to sell you a toy. If you need to speak to a live agent, just say so",
                      "Can I interest you in a toy? "]

  let response = []
  let msg = {
    msg: ""
  }
  let newObj = {}

  //let t = args.sequenceCnt
  //let v = args.obj.dialogue.sequenceCnt
  let t = 2
  let v = 1
  switch(t) {
    case 0:
      msg.msg = interactions[1] + t + " which seems a little low"
      response.push(msg)
      cb(response)
      break;
    case 1:
      msg.msg = interactions[0] + "Guest"
      newObj = Object.assign({}, msg)
      response.push(newObj)
      msg.msg = interactions[4]
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
    case 2:
      msg.msg = interactions[3] + "Default for right testing"
      newObj = Object.assign({}, msg)
      response.push(newObj)
      msg.msg = interactions[5]
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
      msg.msg = "When will this discussion end?"
      newObj = Object.assign({}, msg)
      response.push(newObj)
      cb(response)
      break;
  }

};
//respond returns a string
function wat(args, cb) {
  let interactions = ["hmmm. I didn't understand that. Please try again", "I am here to talk about toys", "Wat? I am stumped. ", "You said "]
  let response = []
  let msg = {
    msg: ""
  }
  let newObj = {}
  // TESTING - TEMPORARY VALUES
  //let t = args.sequenceCnt
  //let v = args.obj.dialogue.sequenceCnt
  let t = 2
  let v = 1
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
      msg.msg = interactions[3] + args.message.Body
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
