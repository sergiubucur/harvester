import * as PIXI from "pixi.js";

import AssetLoader from "./AssetLoader";
import ServerConnection from "components/server-connection/ServerConnection";
import Grid from "components/grid/Grid";
import InputHandler from "components/input-handler/InputHandler";
import DebugDisplay from "components/debug-display/DebugDisplay";

import "./Game.less";

export default class Game {
	init() {
		this._initPixi();
		this._load();
	}

	_initPixi() {
		const app = new PIXI.Application({
			antialias: true
		});

		this.app = app;

		app.renderer.view.style.position = "absolute";
		app.renderer.view.style.display = "block";
		app.renderer.autoResize = true;
		app.renderer.resize(window.innerWidth, window.innerHeight);

		document.body.appendChild(app.view);
	}

	_load() {
		AssetLoader.load(() => {
			this._afterLoad();
		});
	}

	_afterLoad() {
		this._initComponents();

		this.app.ticker.add((delta) => {
			this._update(delta);
		});
	}

	_initComponents() {
		this.input = new InputHandler();
		this.input.init();

		this.grid = new Grid(this.app, this.input);
		this.grid.init();

		this.debug = new DebugDisplay(this);
		this.debug.init();

		this.server = new ServerConnection();
		this.server.onUpdate = (userId, data) => {
			this.grid.onServerUpdate(userId, data);
		};
		this.server.init();

		this.grid.onUnitGoTo = (position) => {
			this.server.unitGoTo(position);
		};
	}

	_update() {
		this.grid.update();
		this.debug.update();
	}
}
