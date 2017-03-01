
///////////////////////////////////////////////////////////
/////////   getproduct microservice        ///////////////
////////   emulates db CRUD operations     //////////////
///////       for configuration            /////////////
///////////////////////////////////////////////////////
var agents =        require('./json/agents')
var systems =       require('./json/platforms')

function main(args) {
      let config = {}
      config.agents =   agents[0].profile.name
      config.systems =  systems[0].platform
      return config
  }

exports.handler = main;
