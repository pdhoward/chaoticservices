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

              respond(args, (response) => {
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
  let interactions = ["I am a live agent ",
                      "This is text number "]
  let response = []
  let msg = {
    msg: ""
  }
  let newObj = {}

  msg.msg = interactions[0] + args.member.firstname
  newObj = Object.assign({}, msg)
  response.push(newObj)
  msg.msg = interactions[1] + args.dialogue.sequenceCnt
  newObj = Object.assign({}, msg)
  response.push(newObj)
  cb(response)
  }



exports.handler = main;
