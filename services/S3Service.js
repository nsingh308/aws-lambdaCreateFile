
let AWS = require("aws-sdk");
const fs = require('fs');

const s3 = new AWS.S3();

const fileName = 'temp.json';

const uploadFile = () => {
    return new Promise((resolve,reject)=>{ 
        fs.readFile(fileName, (err, data) => {
            if (err) reject(err);
            const params = {
                Bucket: 'code-nsingh308', // pass your bucket name
                Key: 'temp.json', // file will be saved as testBucket/contacts.csv
                Body: JSON.stringify(data, null, 2)
            };
            s3.upload(params, function(s3Err, data) {
                if (s3Err) reject(s3Err)
                console.log(`File uploaded successfully at ${data.Location}`)
                resolve(`File uploaded successfully at ${data.Location}`)
                
            });
        });
    });

};

module.exports={uploadFile}