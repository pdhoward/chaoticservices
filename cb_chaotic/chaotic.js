////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////         uses classifier services to            ///////////
///////   decipher intent based on trained data set    ///////////
//////////////////////////////////////////////////////////////////
var natural = require('natural');

function main(args) {
  var raw = args.system.raw;
  var intents = args.system.intents.slice();
  var text = args.text;
  console.log("ENTERED OW MAIN FUNCTION")

  return new Promise (function(resolve, reject){
    classify(text, raw, function(classified) {
      findIntent(classified, intents, function(agent, intent){
        console.log("FINISHED findIntent FUNCTION")
        var context = {}
        context.agent = agent;
        context.intent = intent;
        context.text = 'Hello from the ChaoticBot. I located your new agent '+ agent
        resolve(context)
      })
    })
  })
};

//classify returns an array of intents with confidence intervals.
function classify(text, raw, cb) {
    console.log("ENTERED OW CLASSIFIER FUNCTION")
   var classifier = natural.BayesClassifier.restore(JSON.parse(raw));
   cb(classifier.classify(text))
};

// match top intent from classify with array of intents and associated agents
function findIntent(classified, intents, cb) {
    console.log("ENTERED OW FIND INTENT FUNCTION")
  intents.forEach(function(intent, idx, arr) {
    if (intent.intent == classified){
      var agent = intent.agent;
      var intent = intent.intent;
      return cb(agent, intent)
    }
  })
};

exports.handler = main;
