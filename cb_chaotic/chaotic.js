////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////         uses classifier services to            ///////////
///////   decipher intent based on trained data set    ///////////
//////////////////////////////////////////////////////////////////
var natural = require('natural');

function main(args) {
  var raw = args.context.raw;
  var intents = args.context.intents.slice();
  var text = args.text;
  return new Promise (function(resolve, reject){
    classify(text, raw, function(classified) {
      findIntent(classified, intents, function(agent){
        console.log("FINISHED findIntent FUNCTION")
        args.context.agent = agent;
        Object.assign(args, args.context)
        resolve({args: args})
      })
    })
  })
};

//classify returns an array of intents with confidence intervals.
function classify(text, raw, cb) {
   var classifier = natural.BayesClassifier.restore(JSON.parse(raw));
   cb(classifier.classify(text))
};

// match top intent from classify with array of intents and associated agents
function findIntent(classified, intents, cb) {
  intents.forEach(function(intent, idx, arr) {
    console.log({intent: intent.intent})
    console.log({classify: classified})
    console.log({idx: idx})
    if (intent.intent == classified){
      var agent = intent.agent
      return cb({agent: agent})
    }
  })
};

exports.handler = main;
