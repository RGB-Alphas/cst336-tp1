module.exports = function(socket, client) {
	// client.on("enter_game", function (data) {
	// 	client.emit("login_success", {data: 'hello world'});
	// });
	
	//socket.broadcast.emit("login_success", {data: 'hello world'})
	//client.broadcast.emit("login_success", {data: 'hello world'})
	client.on("login_success", (data)=>{
		console.log(data);
	})
};
