/**
 * @author navdeep.singh
 * This class would provide functions and variables to create table, exist table, update data , delete data, insert data
 * into database table. 
 */
let {moviesSchema} = require('../DbSchema/Movie')
let {docClient,dynamodb} = require('../services/DbService');

class MovieDao{
    
    constructor(){
    }

    /**
     * check if table exist, 
     * if not, create one for use.
     */
    async init(){
        const tableExists = await this.checkIfTableExists();
        
        if(!tableExists){
            try{
               console.log('Creating Table...')
               await this.createTableFunction();
               await this.waitForTableCreation();//can be removed if you dont want to wait for table creation.
            }catch(error){
                console.log('Error Occurred while creating table. Check and debug your code.')
                throw error;
            }
        }else{
            console.log('Table found..')
        }
    }
    
    /**
     * Function to create database Table.
     */
    createTableFunction() {
        return new Promise((resolve,reject)=>{ 
            dynamodb.createTable(moviesSchema, function(err, data) {
                let response;
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
    
    /*Table will not be immediately available. so lets wait for its creation...
      remove this code if you are sure that you are not going to insert immediately after 
      table creation task.
    */              
    waitForTableCreation(){
        return new Promise((resolve,reject)=>{
            const table = { TableName : moviesSchema.TableName }
            dynamodb.waitFor('tableExists', table, (err, data) => {
                if (err) {
                    console.log(err, err.stack);
                    reject(err)
                }else{
                    console.log(data)
                    resolve(data)
                }
            });
        })
    }

    /**
     * Checks if the Table exists in the database.
     * return {*} Boolean
     */
    checkIfTableExists(){
        return new Promise((resolve, reject)=>{
            let status=false;
            const table = { TableName : moviesSchema.TableName }          
            dynamodb.describeTable(table, function(err, data) {
                if (err) {
                    status=false;
                    //console.log(err, err.stack); // an error occurred
                }else {
                    status=true;
                }
                resolve(status);
            });
        })
    }

    /**
     * Function would accept year and title as arguments and returns Promise.
     * @param {*} year 
     * @param {*} title 
     */
    insertIntoMovieFunction(year, title){
        const params = this.prepareDataForInsertion(year, title);
    
        return new Promise((resolve,reject)=>{ 
            docClient.put(params, function(err, data) {
                let response;
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
    
    /**
     * Function would delete Item, based on the parameters.
     * @param {*} year 
     * @param {*} title 
     */
    deleteItemConditionFunction(year, title){
        const params = this.prepareConditionForDeletion(year, title);
    
        return new Promise((resolve,reject)=>{ 
    
            docClient.delete(params, function(err, data) {
                let response;
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
    
    
    /**
     * Function accepts a number, return a promise of result.
     * @param {*} year 
     * @returns {*} Promise 
     */
    selectItemsConditionFunction(year){
        const params = this.prepareQueryForSelect(year)
    
        return new Promise((resolve,reject)=>{ 
            
            docClient.query(params, function(err, data) {
                let response;
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

    prepareConditionForDeletion(year, title){
        return {
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
    prepareDataForInsertion(year, title){
        return {
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
    
    prepareQueryForSelect(year){
        return {
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
}

module.exports={ MovieDao};