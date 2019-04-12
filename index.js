// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const movieDao = require('./dao/MovieDao')
const createFileService = require('./services/CreateFileService')
const s3Service = require('./services/S3Service')

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler =  async(event, context) => {
    try {    //pass the event to call individual functions
        //await movieDao.createTableFunction();
        
        const year = 2015; // these should be passed via event
        /*
        await movieDao.insertIntoMovieFunction(year, '1')
        await movieDao.insertIntoMovieFunction(year, '2')
        await movieDao.insertIntoMovieFunction(year, '3')*/
        const result =await movieDao.selectItemsConditionFunction(year);
        const fileStatus= await createFileService.createFileOnDisk(result);
        const fileWriteToS3Status = await s3Service .uploadFile()
        return fileWriteToS3Status;
    }catch(error){
        console.log(error)
        return error;
    }   
    
};


