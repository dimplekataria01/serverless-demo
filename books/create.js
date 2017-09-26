'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

console.log('Creating new books for you everyday');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'booksTable',
    Item: {
      id: uuid.v4(),
      title: data.title,
      price: data.price,
      author: data.author,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the entry to the database
  dynamoDb.put(params, (error) => {

   if (typeof data.title !== 'string') {
      console.error('Validation Failed');
      callback(new Error('Couldn\'t submit book because of validation errors.'));
      return;
    }

    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the book item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 201,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};

module.exports.dynamoDBStreamTriggered = (event, context, callback) => {
 console.log('event::dynamoDBStreamTriggered ::'+JSON.stringify(event.Records));

 const records = JSON.stringify(event.Records);
  var key = records.dynamodb.Keys.id;
  console.log('key::dynamoDBStreamTriggered ::'+key);
  callback(null, { message: 'Dynamodb item was modified with key: '+ key + '!', event });
};



