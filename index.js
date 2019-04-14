// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const {MovieDao} = require('./dao/MovieDao')
const {FileSystemUtil} = require('./utils/FileSystemUtil')
const {S3Service} = require('./services/S3Service')

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

        const movieDao = new MovieDao();
        await movieDao.init();
        const fileSystemUtil = new FileSystemUtil();
        const s3Service = new S3Service();
        const year = 2015; // these should be passed via event
        
        const firstInsertion = await movieDao.insertIntoMovieFunction(year, '1')
        console.log(firstInsertion);
        const secondInsertion = await movieDao.insertIntoMovieFunction(year, '2')
        console.log(secondInsertion);
        const thirdInsertion = await movieDao.insertIntoMovieFunction(2000, '33')
        console.log(thirdInsertion);
        const data =await movieDao.selectItemsConditionFunction(2000);
        console.log(data);
        //for AWS environment use : /tmp//
        const tempFileName='/tmp//local-temp.json', bucketFileName='uploadedFile.json', bucketName='code-nsingh308';
        const fStatus = await fileSystemUtil.createFileOnDisk(data,tempFileName);
        if(!fStatus){
            console.log('could not create file.')
            return { 
                statusCode: 400, 
                body: `Could not create file, Error occurred. you should debug.`
            }
        }//tempFileName, bucketFileName, bucketName
        const fileWriteToS3Status = await s3Service.uploadFile(tempFileName, bucketFileName,bucketName)
        return fileWriteToS3Status
    }catch(error){
        console.log(error)
        return error;
    }   
    
};


