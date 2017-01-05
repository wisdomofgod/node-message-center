NODEJS-MESSAGE-CENTER
====

###支持
	1，socket发送消息给socket，一对一，一对多（多对多）
	2，socket发送消息给httpAPI, 一对一
	3，http发送消息给socket	一对一，一对多(多对多)
	4, http发送消息给http		一对一(解决跨域问题)

###使用与例子
	1, 启动服务 `nodejs server.js`
	2, 访问例子 http://127.0.0.1:8070

###参数说明
	1, 客户端与服务端建立连接后，发送注册信息, json数据格式
		{'type':'login','token':'23333', 'groupKey': 'test'}
		其中type是事件类型, token是客户端唯一标识, groupKey是聊天室或订阅消息的key，一个客户端可以有多个订阅或加入多个聊天室

	2,  客户端发送信息(socket客户端、http客户端)
		{'token':'23333',"type":"user",
            'data':{
                "type": 'number'
            }
        }
        其中type是事件， 标识该消息为to one消息, data内是信息内容

        {'token':'23333',"type":"group",groupKey: 'test',
            'data':{
                "type": 'HHH'
            }
        }
        该消息是to many消息, data内是消息内容

    	{
		  "type": "httpMessage",
	        "data": {
	            "url": "http://offlinestore.landaojia.com/ldj-offline-store/operators/login",
	            "options": {
	                "method": "POST",
	                "headers": {
	                    "Content-Type": "application/json;charset=UTF-8"
	                }
	            },
	            "data": JSON.stringify(obj)
	        }
    	}
    	该消息标明需要服务器发起一个http请求,data内是ajax参数