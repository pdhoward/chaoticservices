
///////////////////////////////////////////////////////////
/////////   getproduct microservice        ///////////////
////////   emulates db CRUD operations     //////////////
///////       for products                 /////////////
///////////////////////////////////////////////////////

var casual = require('casual');

const faker = {
  commerce: {
    price: function(){
      return '200'
    },
    productName: function(){
      return 'hammer'
    },
    technics: function(){
      return 'picture'
    }
  },
  lorem: {
    sentences: function(){
      return 'this is a sentence'
    }
  }
}

function main(args) {
    const apiType = args.apiType || 'UNK';
    const product = args.product || 'UNK';   // note - simply returned in spoof

    switch (apiType) {
      case "get":
          return new Promise(function(resolve, reject) {
           resolve( { product: product,
                      price: faker.commerce.price(),
                      name: faker.commerce.productName(),
                      img: faker.commerce.technics(),
                      description: faker.lorem.sentences(),
		              city: casual.city,
					  country: casual.country,
					  text: casual.text,
					  email: casual.email,
					  phone: casual.phone,
					  card: casual.card_data
					  })
        })
      break;
      case "put":
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve({ done: true,
                      op: 'put',
                      api: 'getproduct'});
          }, 100);
        })
      break;
      case "post":
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve({ done: true,
                        op: 'post',
                        api: getproduct});
          }, 100);
        })
      break;
      case "delete":
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve({ done: true,
                        op: 'delete',
                        api: getproduct});
          }, 100);
        })
      break;
     default:
        console.log('GETPRODUCT UNKNOWN API')
      break;
  }
};

exports.handler = main;
