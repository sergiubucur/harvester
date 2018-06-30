import * as PIXI from "pixi.js";

export default class DebugDisplay {
	constructor(game) {
		this.game = game;
	}

	init() {
		const style = new PIXI.TextStyle({
			fill: "#fff",
			stroke: "#000",
			strokeThickness: 5
		});

		const text = new PIXI.Text("harvester", style);
		this.text = text;

		text.x = 10;
		text.y = 10;
		text.anchor.set(1, 0);
		text.position.set(window.innerWidth - 25, window.innerHeight - 50);

		this.game.app.stage.addChild(text);
	}

	update() {
		let str = "";

		str += `latency: ${this.game.server.latency}ms`;

		this.text.text = str;
	}
}
