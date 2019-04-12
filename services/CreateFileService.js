const fs = require('fs');
//Function to save note on disk.
var createFileOnDisk = (data) =>{
    try{
        fs.writeFileSync('temp.json',JSON.stringify(data));
        return 'Success';
    }catch(error){
        
        return error;
    }
};

module.exports={
    createFileOnDisk
}