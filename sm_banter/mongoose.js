//   mongoose example

exports.handler = (event, context, callback) => {
  let response;

  return mongoose.connect(process.env.DATABASE_URL, {
    useMongoClient: false
  }).then((ee) => {
    // prepare your response
    response = { hello: 'world' }
  }).then(() => {
    mongoose.disconnect()
  }).then(() => {
    // Success
    callback(null, response)
  }).catch((err) => {
    console.error(err);

    callback(err);
  })
};
