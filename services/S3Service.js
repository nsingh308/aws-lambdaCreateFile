/**
 * @author Navdeep Singh
 */
let AWS = require("aws-sdk");
const fs = require('fs');
const s3 = new AWS.S3();

/**
 * S3 Service which would provide methods for S3 Aws Environment.
 */
class S3Service{
        /**
         * Function would read the local file and if successfull, it would upload the data in S3 Bucket.
         * @param {*} tempFileName local file name in which data is stored
         * @param {*} bucketFileName file name which would be created in S3
         * @param {*} bucketName bucket name which is present in S3 AWS environment
         */
        uploadFile(tempFileName, bucketFileName, bucketName){
            return new Promise((resolve,reject)=>{ 
                fs.readFile(tempFileName, (err, data) => {
                    if (err) reject(err);
                    const params = {
                        Bucket: bucketName, // pass your bucket name
                        Key: bucketFileName, // file will be saved as testBucket/contacts.csv
                        Body: JSON.stringify(data, null, 2)
                    };
                    s3.upload(params, function(s3Err, data) {
                        if (s3Err) reject(s3Err)
                        console.log(`File uploaded successfully at ${data.Location}`)
                        resolve(`File uploaded successfully at ${data.Location}`)
                        
                    });
                });
            });
        }
}

module.exports={S3Service}