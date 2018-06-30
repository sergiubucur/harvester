import * as PIXI from "pixi.js";

import Config from "common/Config";

const Assets = [
	{ name: "sand", path: "assets/textures/sand.png" },
	{ name: "blue_crystals_1", path: "assets/textures/blue_crystals_1.png" },
	{ name: "marker", path: "assets/textures/marker.png" },
	{ name: "selection", path: "assets/textures/selection.png" },
	{ name: "harvester", path: "assets/textures/harvester/harvester.json" }
];

export default class AssetLoader {
	static load(afterLoad) {
		Assets.forEach(x => {
			PIXI.loader.add(x.name, Config.assetsPath + x.path);
		});

		PIXI.loader.load(afterLoad);
	}
}
