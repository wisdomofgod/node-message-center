var http = require('http')
var socketio =  require('socket.io');
var fs = require('fs');

var Wisdom = require('./lib/wisdom.js');
var w = new Wisdom();

var query = require("querystring");    //解析POST请求


var save = require('./app/routers/save.js');
var socketService = require('./lib/socketService.js');
var socketMethod = new socketService();
var HttpService = require('./lib/httpService.js');
var httpMethod = new HttpService();


var socketList = [];

w.use(encrypt);
w.use(decode);
w.use('save',save);


function handler (request, response) {
	if(request.method == "get" || request.method == "GET"){
		fs.readFile(__dirname + '/index.html',function (err, data) {
			if (err) {
				response.writeHead(500);
				return response.end('Error loading index.html');
			}
			response.writeHead(200);
			response.end(data);
		});
	}else{
		var postdata = "";
		request.addListener("data",function(postchunk){
			postdata += postchunk;
		})

		//POST结束输出结果
		request.addListener("end",function(){
			var params = JSON.parse(postdata);

			//response.write(JSON.stringify(params));
			//response.end();

			httpMethod.getMessage(params, response);
		});
	}
}

function decode(res , req, next) {
	next( res , req );
}

function encrypt(res ,  req , next){
	res.send = function (data) {
		res.emit('', JSON.stringify(data));
	}
	next(res , req);
}

function connection(socket) {

	socketList.push(socket);

	//socket.on('connection', function (socket) {
	//	socketList.push(socket);
	//	console.log(socketList.length);
	//});

	socket.on('disconnect', function () {
		var index = socketList.indexOf(socket);
		if(index > -1){
			socketList.splice(index, 1);
		}
	});

	socket.on('', function (data) {
		//save.index(socket,data);
		//w.router(socket, data);
		socketMethod.getMessage(data, socket);
	});
};

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var addIO = (function(){
	var ios = [];
	return {add:function(io){
		ios.push(io);
	}};
})();

if(cluster.isMaster){
    console.log('[master] ' + "start master...");

    //for (var i = 0; i < numCPUs; i++) {
    //     cluster.fork();
    //}
	for (var i = 0; i < 1; i++) {
		cluster.fork();
	}

    cluster.on('listening', function (worker, address) {
        console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    });
}else{
	console.log('[worker] ' + "start worker ..." + cluster.worker.id);    
	
	/**
	 * Create HTTP server.
	 */

	var server = http.createServer(handler);
	var io = socketio(server);
	
	server.listen(8070);

	io.on('connection',connection);

	addIO.add(io);
}


var compute = function(params){
	switch(params['type']){
		case "add": return parseFloat(params['num']) + parseFloat(params['num1']);break;
		case "subtract": return parseFloat(params['num']) - parseFloat(params['num1']);break;
		case "multiplication": return parseFloat(params['num']) * parseFloat(params['num1']);break;
		case "division": return parseFloat(params['num']) / parseFloat(params['num1']);break;
	}
}
