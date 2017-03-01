////////////////////////////////////////////////////////////////////
/////////          chaotic microservice                 ///////////
////////         order management microservices         ///////////
//////////////////////////////////////////////////////////////////

var app = require('express')().use(require('body-parser')());

function main(args) {
  console.log("ORDER MANAGEMENT FUNCTION")
  var text = args.text;
  var orders = []
  if (args.context.orders){
    orders = args.context.orders
  }
  orders.push(text)
  args.context.orders = orders.slice();
  Object.assign(args, args.context)
  return {args: args}
};

exports.handler = main;
