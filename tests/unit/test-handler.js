'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests DynamoDb Create Handler', function () {
    it('verifies successful response', async () => {
        const result = await app.handler(event, context);
        console.log(result);
         //expect(result).to.be.an('object');
       // expect(result.statusCode).to.equal(202);
        

        
        //expect(result.body).to.be.an('string');

        //let response = JSON.parse(result.body);

        //expect(response).to.be.an('object');
        //expect(response.statusCode).to.be.equal("202");
        // expect(response.location).to.be.an("string");
    });
});
