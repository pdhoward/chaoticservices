////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////             banter and direct                 ///////////
//////////////////////////////////////////////////////////////////
var greeting = require('greeting');
const request = require('request-promise');

const rp = request({
  uri: 'http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en',
  json: true,
  headers: {'User-Agent': 'OpenWhisk'}
})

const errorResponse = [
  'Hmmm. The quote machine is not working. Try again later',
  'This is a surprise. I am out of quotes says the chaoticbot',
  'Oh oh. The Quote bot seems to be offline. Sorry'
]

var visit = {
  isReturn: false,
  isKnown: false,
  count: 0
}

function main(args) {
  console.log("BANTER")

  ////////////////////////////////////////////////////
  //////  Test Session Variable: New discussion?  ////
  ////////////////////////////////////////////////////

  var req = Object.assign({}, args.system.req);
  var clients = args.system.clients.slice();

  if (req.session.count) {
    visit.isReturn = true,
    visit.count = req.session.count
     }

  var client = clients.find(function( item ) {
     return item.phone == args.sender;
   });
  console.log({client: client})
  console.log({sender: args.sender})

  if (client !== undefined) {
      visit.isKnown = true;
      visit.name =    client.contact;
      visit.company = client.name;
      visit.state =   client.state;
  }

  var text = args.text;
    return new Promise (function(resolve, reject){
      respond(text, function(response) {
          var result = {};
          result.sender = 'Banter';
          result.receiver = undefined;
          result.callback = false;
          result.restart = false;
          result.redirect = false;
          result.orgmessage = undefined;
          result.text = response;
          resolve(result)
      })
    })
  };

//respond returns a string
function respond(text, cb) {
    if (visit.isKnown) {
      var extraText = '' + visit.name
    } else {
      var extraText = ' new guy';
    }

    if (text.match(/quote/i)) {
        return rp
          .then(function(res){
            var response = res;
            cb(response);})
          .catch(function (err) {
            getRandomInt(0, 2, function(x){
              var response = errorResponse[x];
              cb(response)
            })
        });
    } else {
      var greet = greeting.random()
      var response = greet + extraText
      cb(response)
  }
};

function getRandomInt(min, max, cb) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    return cb(result);
  }

exports.handler = main;
