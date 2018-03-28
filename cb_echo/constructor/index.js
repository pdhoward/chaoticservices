
///////////////////////////////////////////////////////////////////
//// constructor to instantiate key functions for microservices //
/////////////////////////////////////////////////////////////////

const request =                 require('request')
const schema =                  require('schm')
const methods =                 require('schm-methods')
const {interactObject} =        require('../db/schemas/Interact')

/*
exports.microObject = schema(interactObject,
        methods({
            getSender: (values) => {return values.message.From},
            getReceiver: (values) => {return values.message.To},
            getMessage: (values) => {return values.message.Body},
            getSenderCity: (values) => {return values.message.FromCity},
            getSenderState: (values) => {return values.message.FromState},
            getMachineName: (values) => {return values.machine.getMachineName},
            getMachineSlot: (values) => {return values.machine.thisSlot},
            getAgentName: (values) => {return values.agent.name},
            getDialogueCnt: (values) => {return values.dialogue.sequenceCnt}
      })
    )
*/
exports.microObject = schema(interactObject)

exports.Message = class Message {

  constructor(obj) {
    this.obj = obj
  }

  get sender() {
    return this.obj.message.From
  }
  get text() {
    return this.obj.message.Body
  }
  get sequenceCnt() {
    return this.obj.dialogue.sequenceCnt
  }
  get postdate() {
    return this.obj.postdate
  }
  get statusInteraction() {
    return this.obj.status.isNewInteraction
  }

}


////////////////////////////////////////
// future development footnote
///////////////////////////////////////
const Api = class Api {
    constructor (workobj) {
      }

    getMessage () {
      return new Promise((resolve, reject) => {
        resolve(this.message)
      })
    }

    getMessageFrom () {
      return new Promise((resolve, reject) => {
        resolve(this.message.From)
      })
    }

    getMachineName () {
      return new Promise((resolve, reject) => {
        resolve(this.machine.name)
        })
      }

    getAgentResponse (apiparm) {
      return new Promise((resolve, reject) => {
        /*
        request.get(apiparm, function (error, response, body) {
                  if (error) {
                      console.log(error)
                      reject(error)}
                  resolve(body)
            })
            */
     //
     postAgentResponse = (apiparm) => {
          return new Promise((resolve, reject) => {
         request.post(
                 apiparm.url,
                 { json: apiparm.body },
                 function (error, response, body) {
                   if (error) {
                       console.log(error)
                       reject(error)}
                   resolve(body)
             });
          })
        }
      resolve("working on api agent response")
      })
    }
  }
