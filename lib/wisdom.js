file:///var/gits/new/make/makes/app.js

function Wisdom() {
	this.stack = [];
	this.n = 0;
}

module.exports = Wisdom;

Wisdom.prototype.use = function () {
	var args = arguments;
	if( typeof args[0]  == "function"){
		this.stack.push({name:'before',f:args[0]});	
	}else{
		this.stack.push({name:args[0],f:args[1]});
	}
};

Wisdom.prototype.router = function (res,req) {
		var that = this;
		this.n = 0;
		this.stack[0].f.call(this , res , req , function(){
			that.next.apply(that,arguments);
		});
}

Wisdom.prototype.next = function (res , req) {
		var that = this;
		this.n++;
		if(this.stack[this.n] .name != 'before'){
			var newO = new this.stack[this.n].f();
			newO.index(res, req , function(){
				that.next.apply(that,arguments);
			});
		}else{
			this.stack[this.n].f(res,req,  function(){
				that.next.apply(that,arguments);
			});
		}

}