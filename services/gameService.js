module.exports = function(socket, client) {
	client.on("game_start", (data)=>{
		console.log("this is the ")
		console.log(data);
		client.emit("received", {data:"received hello"});
	})
};
