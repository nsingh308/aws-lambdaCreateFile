/**
 * Dynamo Database connection will be obtained here. 
 * This file would use default logged in credentials of api key and secret in local 
 * and policy permissions of role in aws environment.
 */
let AWS = require("aws-sdk");

AWS.config.update({region: "us-east-1"});

let dynamodb = new AWS.DynamoDB();
let docClient = new AWS.DynamoDB.DocumentClient();


module.exports={
    dynamodb, docClient
}