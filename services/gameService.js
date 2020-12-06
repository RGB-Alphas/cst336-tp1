var playerArray = [];

module.exports = function(socket, client) {

	client.on("playerJoined", (data)=>{
		var player = JSON.parse(data);
		playerArray.push(player);
		console.log("# of Players: ", playerArray.length);
		client.emit("received", JSON.stringify(playerArray));
	})

	client.emit("received", JSON.stringify(playerArray));
};
