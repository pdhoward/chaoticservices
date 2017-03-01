'use strict';

function main(params) {
  const name = params.name || 'World';
  return {lines: ['Hello', name, '!']};
}

exports.handler = main;
