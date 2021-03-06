'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'booksTable',
};

module.exports.list = (event, context, callback) => {
  // fetch all books from the database
  dynamoDb.scan(params, (error, result) => {

    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the books.'));
      return;
    }
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
