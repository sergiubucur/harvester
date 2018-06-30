import io from "socket.io-client";

import Config from "common/Config";

export default class ServerConnection {
	socket = null;

	lastReceived = Date.now();
	latency = 0;

	onUpdate = () => {};

	init() {
		this.socket = io(Config.serverUrl);

		this.socket.on("update", data => {
			this.latency = Date.now() - this.lastReceived;
			this.lastReceived = Date.now();

			this.onUpdate(this.socket.id, data);
		});
	}

	unitGoTo(position) {
		this.socket.emit("unit-go-to", position);
	}
}
