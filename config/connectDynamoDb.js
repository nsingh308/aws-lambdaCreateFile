let AWS = require("aws-sdk");
const access = require('./access.js');

AWS.config.update(access.aws_remote_config);

let dynamodb = new AWS.DynamoDB();
let docClient = new AWS.DynamoDB.DocumentClient();


module.exports={
    dynamodb, docClient
}