var redis = require('redis');
var client = redis.createClient();

function Redis() {}

module.exports = Redis;

Redis.prototype.set  = function (key,value,callback) {
		client.lpush(key,value,function(err,response){
			callback(response);}
		);
	
}

Redis.prototype.getArray = function (key,callback) {
	client.lrange(key,0,10,function(err,response){
			var data = [];
			for(var i=0,len=response.length;i<len;i++){
				data.push(new Buffer(response[i]));	
			}
			callback(data);
	});
}

Redis.prototype.get = function (key,callerror,callback) {
	client.get(key,function (err, response) {
			console.log(response);
			if(err || !response || response == null) callerror();
			return callback(response);
	});
}