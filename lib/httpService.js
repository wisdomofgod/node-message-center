/*
 * Created by wisdomOfGod on 16/9/8.
 */
var util = require('util'),
    http = require('http');

function HttpService(){

}

HttpService.prototype = {
    author: function() {

    },
    getMessage: function(req, res, next) {
        if (req.type == 'user') {
            var socketService = require('./socketService.js');
            var socketMethod = new socketService();
            socketMethod.sendMessage(req.token, req.data);
        }else if (req.type == 'group') {
            var socketService = require('./socketService.js');
            var socketMethod = new socketService();
            socketMethod.groupMessage(req.groupKey, req.data);
        } else if (req.type === 'httpMessage') {
            this.sendMessage(req.data, res, 'http');
            return;
        }

        res.write('success');
        res.end();
    },
    sendMessage: function(req, res, type, next) {

        if( req.url ){

        }

        var options = req.options;

        httpPost(req.url, '', options, req.data, (body) => {
            if (type === "http") {
                res.write(body);
                res.end();
            } else {
                res.emit('',JSON.stringify(body));
            }
        });


    }
}

function httpPost(url, port, options, content, callback) {
    var urlStr = url.substr(0,5), startIndex = 0;
    var hostname = '',path = '';
    if(urlStr == 'https'){
        startIndex = 8;
        url = url.substr(8);
    }else if(urlStr == 'http:'){
        startIndex = 7;
        url = url.substr(7);
    }

    var index = url.indexOf('/',startIndex);
    if(index >= 0){
        hostname = url.substr(0,index);
        path = url.substr(index);
    }else{
        hostname = url;
    }

    index = hostname.indexOf(':',startIndex);
    if(index >= 0){
        hostname = hostname.substr(0,index);
        port = hostname.substr(index+1);
    }

    options.hostname = hostname;
    options.path = path
    if( port ){
        options.port = port;
    }else{
        options.port = '80';
    }


    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        var data = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            callback(data);
        })
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    if( content ){
        req.write(content);
    }

    req.end();
}

module.exports = HttpService;