var md = require('../modules/index.js');
var mod = new md();

function Index(){
}

module.exports = Index;

Index.prototype.index = function index(res,req,next){
	var data = req;
	console.log(data);
	res.send(data);
};