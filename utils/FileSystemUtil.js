const fs = require('fs');

/**
 * This class provides file system utility method.
 */
class FileSystemUtil{

    /**
     * Simple Method to create file on disk
     * @param data - argument can be any jason.  
     * @param filename - filename with which you want to create file on disk.
     */
    createFileOnDisk(data, filename){
        return new Promise((resolve, reject)=>{
            try{
                fs.writeFileSync(filename,JSON.stringify(data));
                resolve(true)
            }catch(error){
                console.log(error)
                reject(false)
            }
        });
    }
}

module.exports={ FileSystemUtil };
