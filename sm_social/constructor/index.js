
///////////////////////////////////////////////////////////////////
//// constructor to instantiate key functions for microservices //
/////////////////////////////////////////////////////////////////

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
  get confidence(){
    return this.obj.classifier.confidence
  }
  get senderName(){
    return this.obj.member.firstname
  }
  get senderCity(){
    return this.obj.member.city
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
