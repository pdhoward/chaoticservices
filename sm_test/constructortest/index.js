// repository.js
'use strict'
///////////////////////////////////////////////////////////////////
//// constructor to instantiate key functions for microservices //
/////////////////////////////////////////////////////////////////

const db =                    require('./db')
//const { g, b, gr, r, y } =    require('../console')


// factory function, that holds an open connection to the db,
// and exposes some functions for accessing the data.
const repository = () => {

  // since this is the platform service, we already know
  // that we are going to query the `movies` collection
  // in all of our functions.
//  const collection = db.collection('Member')

  let workObj = {}
  let conn = {}

  //////////////////////////////////////////////////////
  /////                Members                 ///////
  ////////////////////////////////////////////////////
  const findMember = () => {
    console.log("Entered findMember")
    let obj = workObj
    return new Promise((resolve, reject) => {
      resolve(db.findMember(obj, conn))
      })
    }
  const updateWorkObj = (obj) => {
    console.log("entered set workobj")
    //console.log(obj)
    workObj = { ...workObj, ...obj }
  }
  const getWorkObj = () => {
    return workObj
  }
  const setConnection = (connection) => {
    console.log("Entered Set Connection")
    conn = connection

    conn.on('close', () => {
      console.log('Experiment - connection closed...')
    })

    return
    }

  // this will close the database connection
  const disconnect = () => {
    console.log("Did This Really Close ??")
    conn.close()
  }

  return Object.create({
    workObj,
    setConnection,
    updateWorkObj,
    getWorkObj,
    findMember,
    disconnect})
  }

const connect = () => {
  return new Promise((resolve, reject) => {
    /*
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    */
    resolve(repository())
  })
}

// the only exposed method of this module
module.exports = Object.assign({}, {connect})

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
