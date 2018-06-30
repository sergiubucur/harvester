require("seedrandom");

const app = require("http").createServer();
const io = require("socket.io")(app);

const Simulation = require("./simulation/Simulation");
const simulation = new Simulation();
simulation.onUpdate = () => {
	io.emit("update", simulation.getSnapshot());
};
simulation.init();

const Port = process.env.PORT || 5000;
app.listen(Port);
console.log(`listening on port ${Port}`);

io.on("connection", (socket) => {
	console.log("connect", socket.id);

	simulation.addUser(socket.id);
	io.emit("update", simulation.getSnapshot());

	socket.on("unit-go-to", (position) => {
		simulation.unitGoTo(socket.id, position);
	});

	socket.on("disconnect", () => {
		console.log("disconnect", socket.id);

		simulation.removeUser(socket.id);
		io.emit("update", simulation.getSnapshot());
	});
});
