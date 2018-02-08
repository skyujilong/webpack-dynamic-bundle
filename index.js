'use strict';
const inspect = require('util').inspect;
const fs = require("fs");
const path = require('path');

function WebpackDynamicBundle() {

}

WebpackDynamicBundle.prototype.apply = function (compiler) {
    compiler.plugin('emit', (compilation, cb) => {
        //TODO: 根据compilation 中的getState方法，来获取对应的内容。
        let {
            compilation: result
        } = compilation.getStats();
        let {
            chunks,
            namedChunks,
            entrypoints,
            modules
        } = result;
        //TODO: 排除entrypoints中的 bundle


        // for (let chunksInfo of namedChunks){
            // writeInspect(chunksInfo, chunksInfo.);
        // }
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
            writeInspect(namedChunks[key], `${key}-info.json`);
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

        writeInspect(info,'resultInfo.json');


        fs.writeFile(path.resolve(__dirname, 'chunks.json'), inspect(chunks), function (err) {
            if (err) {
                throw err;
            }
            console.log('write done......');
        });

        fs.writeFile(path.resolve(__dirname, 'sort-other.json'), inspect(namedChunks['other']),function(err){
            if (err) {
                throw err;
            }
            console.log('write done......');
            //console.log(namedChunks['dynamic']._modules);
        })

        fs.writeFile(path.resolve(__dirname, 'sort-dynamic1.json'), inspect(namedChunks['dynamic']), function (err) {
            if (err) {
                throw err;
            }
            console.log('write done......');
            //console.log(namedChunks['dynamic']._modules);
        })


        fs.writeFile(path.resolve(__dirname, 'namedChunks.json'), inspect(namedChunks), function (err) {
            if (err) {
                throw err;
            }
            console.log('write done......');
        });

        fs.writeFile(path.resolve(__dirname, 'modules.json'), inspect(modules), function (err) {
            if (err) {
                throw err;
            }
            console.log('write done......');
        });

        cb();
    });
}


function writeInspect(obj,fileName){
    fs.writeFile(path.resolve(__dirname,fileName),inspect(obj),function(err){
        if(err){
            throw err;
        }
        console.log('write done');
    });
}


module.exports = WebpackDynamicBundle;