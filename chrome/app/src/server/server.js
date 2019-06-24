const { 
    getWords,
    getContexts,
    saveContext,
    saveTranslation,
    updateTranslation
} = require('./database');
const http = require('http');
const { parse } = require('querystring');

function requestReducer (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    const databaseActions = {
        getWords: getWords,
        getContexts: getContexts,
        saveTranslation: saveTranslation,
        updateTranslation: updateTranslation,
        saveContext: saveContext
    }

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        const action = parse(body).action;
        const params = parse(body);

        try {
            databaseActions[action](params).then(data => {
                res.end(JSON.stringify(data))
            })
        } catch (err) {
            console.log("Server failed to execute action ", action)
            res.end()
        }
    });
}

http.createServer(requestReducer).listen(5000);
