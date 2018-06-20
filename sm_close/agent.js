////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             echo and direct                 ///////////
//////////////////////////////////////////////////////////////////
const greeting =              require('greeting');
const request =               require('request-promise');
const {createMachine} =       require('@xmachina/message')

function main(obj) {

  // compose response or redirect
  return new Promise (function(resolve, reject){
          let result = {};
          console.log("--------Close---------")
          const m = createMachine()

          m.updateWorkObj(obj)         // intialize work object with schema model

          let args = m.getWorkObj()
              // begin to construct the response object
              result.sender = args.message.From
              result.orgmessage = args
              // get the agent response
              result.reply = []

              respond(args, (response) => {
                  result.reply = response.slice()
                  m.setResponse(result)
                  let newObj = m.getWorkObj()
                  resolve(newObj)
                  //return
              })

        //  result.reply.push({'link': 'http://www.example.com/'})
    })
  }

//respond returns a string
function respond(args, cb) {
  let interactions = ["Hey, I close deals ",
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
