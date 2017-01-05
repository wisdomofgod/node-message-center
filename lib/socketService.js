/**
 * Created by lazyhome on 16/9/8.
 */

var httpService = require('./httpService.js');
var httpMethod = new httpService();
var clientList = {};
var groupList = {};

function SocketService(){

}

SocketService.prototype = {
    getMessage: function(res, socket) {
        res = JSON.parse(res);
        if (res.type == 'login') {
            clientList[res.token] = socket;
            if (res.groupKey) {
                if (!groupList[res.groupKey]) {
                    groupList[res.groupKey] = [];
                }
                groupList[res.groupKey].push(socket);
            }
        } else if (res.type == 'httpMessage') {
            httpMethod.sendMessage(res.data, socket);
        } else if (res.type === 'user') {
            this.sendMessage(res.token, res.data);
        } else if (res.type === 'group') {
            this.groupMessage(res.groupKey, res.data);
        }
    },
    groupMessage: function(key, data) {
        var group = groupList[key];
        if(group){
            for (var i = 0; i < group.length; i++) {
                group[i].emit('',JSON.stringify(data));
            }
        }
    },
    sendMessage: function(token, data){
        var socket = clientList[token];
        if (socket) {
            socket.emit('',JSON.stringify(data));
        } else {
            return false;
        }
    }
}


module.exports = SocketService;