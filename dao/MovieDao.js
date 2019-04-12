let {moviesSchema} = require('../TableSchemaDefs/MovieSchemaDef')
let {docClient,dynamodb} = require('../config/connectDynamoDb');

const createTableFunction = ()=>{
    return new Promise((resolve,reject)=>{ 
        dynamodb.createTable(moviesSchema, function(err, data) {
            if (err) {              
                response= {
                'statusCode': 400,
                'body': "Unable to create table. Error JSON:"+ JSON.stringify(err,null,2)
            }
                reject(response)
            }else{
                response= {
                    'statusCode': 202,
                    'body': "Created table. Table description JSON:"+ JSON.stringify(data,null,2)
                }
                resolve(response)
            }
        });
    });
}

const insertIntoMovieFunction = (year, title)=>{
    const params = prepareDataForInsertion(year, title);

    return new Promise((resolve,reject)=>{ 
        docClient.put(params, function(err, data) {
            if (err) {              
                response= {
                'statusCode': 400,
                'body': `Unable to insert into ${moviesSchema.TableName}. Error JSON:`+ JSON.stringify(err,null,2)
            }
                reject(response)
            }else{
                response= {
                    'statusCode': 202,
                    'body': `Added Item :`+ JSON.stringify(data,null,2)
                }
                resolve(response)
            }
        });
    });
}

const deleteItemConditionFunction = (year, title)=>{
    const params = prepareConditionForDeletion(year, title);

    return new Promise((resolve,reject)=>{ 

        docClient.delete(params, function(err, data) {
            if (err) {              
                response= {
                'statusCode': 400,
                'body': `Unable to delete item. Error JSON:`+ JSON.stringify(err,null,2)
            }
                reject(response)
            }else{
                response= {
                    'statusCode': 200,
                    'body': `Delete Item Succeeded :`+ JSON.stringify(data,null,2)
                }
                resolve(response)
            }
        });
    });
}



const selectItemsConditionFunction = (year)=>{
    const params = prepareQueryForSelect(year)

    return new Promise((resolve,reject)=>{ 
        
        docClient.query(params, function(err, data) {
            if (err) {              
                response= {
                'statusCode': 400,
                'body': `Unable to query item. Error JSON:`+ JSON.stringify(err,null,2)
            }
                reject(response)
            }else{
                let items=[]
                data.Items.forEach(function(item) {
                    console.log(" -", item.year + ": " + item.title);
                    items.push(item.year + ": " + item.title);
                });
                response= {
                    'statusCode': 200,
                    'body': `Query succeeded :`+ JSON.stringify(data,null,2)
                }
                resolve(response)
            }
        });
    });
}




module.exports={createTableFunction,insertIntoMovieFunction,deleteItemConditionFunction,selectItemsConditionFunction}

const prepareConditionForDeletion = (year, title)=>{
    return params = {
        TableName:moviesSchema.TableName,
        Key:{
            "year": year,
            "title": title
        },
        ConditionExpression:"info.rating >= :val",
        ExpressionAttributeValues: {
            ":val": 0
        }
    };
}
const prepareDataForInsertion = (year, title)=>{
    return params = {
        TableName:moviesSchema.TableName,
        Item:{
            "year": year,
            "title": title,
            "info":{
                "plot": "Nothing happens at all.",
                "rating": 0
            }
        }
    }    
}

const prepareQueryForSelect = (year)=>{
    return params = {
        TableName : moviesSchema.TableName,
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames:{
            "#yr": "year"
        },
        ExpressionAttributeValues: {
            ":yyyy": year
        }
    };
    
}