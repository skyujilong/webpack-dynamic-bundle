'use strict';
const inspect = require('util').inspect;
const fs = require("fs");
const path = require('path');

function WebpackDynamicBundle(options) {
    if (!options || !options.filePath){
        throw new Error('need file path!');
    }
    if(!path.isAbsolute(options.filePath)){
        throw new Error('need absolute file path!');
    }
    this.options = options;
}

WebpackDynamicBundle.prototype.apply = function (compiler) {
    let {filePath} = this.options;
    compiler.plugin('emit', (compilation, cb) => {
        //根据compilation 中的getState方法，来获取对应的内容。
        let {
            compilation: result
        } = compilation.getStats();
        let {
            chunks,
            namedChunks,
            entrypoints,
            modules
        } = result;
        /*
        {
            // chunkId:'',
            // name:'',
            // chunkPath:'',
            // md5:'',
            // modules:[
            //     {
            //         id:'',
            //         pathKey:''
            //     }
            // ];
            id:'',
            keyPath:'',
            chunk:{
                chunkId:'',
                chunkName:'',
                md5:'',
                path:''
            }
        }
        */
        let info = [];
        for (let key in namedChunks){
            let chunkInfo = namedChunks[key];
            if (chunkInfo.entrypoints.length > 0) {
                continue;
            }
            for (let __module of chunkInfo['_modules']){
                info.push({
                    id:__module.id,
                    keyPath: __module.resource,
                    chunk:{
                        id: chunkInfo.id,
                        chunkName: chunkInfo.name,
                        path: chunkInfo.files[0],
                        md5: chunkInfo.hash
                    }
                });
            }
        }

        fs.writeFile(filePath, JSON.stringify(info),function(err){
            if(err) throw err;
            cb();
        });
    });
}


module.exports = WebpackDynamicBundle;