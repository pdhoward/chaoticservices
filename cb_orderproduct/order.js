////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////         order management microservices         ///////////
//////////////////////////////////////////////////////////////////

var app = require('express')().use(require('body-parser')());
var orders = []

function main(args) {
  console.log("ORDER MANAGEMENT FUNCTION")
  var text = args.text;
  orders.push(text)
  return {payload: orders}
};
exports.handler = main;
