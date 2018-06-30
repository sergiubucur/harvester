import * as PIXI from "pixi.js";

import Constants from "common/Constants";
import Vector2 from "common/Vector2";

const MapCellSprite = {
	".": "sand",
	"x": "blue_crystals_1"
};

export default class MapBuilder {
	rng = new Math.seedrandom("harvester");

	build() {
		const container = new PIXI.Container();
		const matrix = [];

		for (let i = 0; i < Constants.GridWidth; i++) {
			const row = [];

			for (let j = 0; j < Constants.GridHeight; j++) {
				let cellType = ".";
				if (i > 0 && j > 0 && this.rng() < 0.25) {
					cellType = "x";
				}

				const cell = this._getCell(j, i, cellType);
				container.addChild(cell.sprite);
				row.push(cell);
			}

			matrix.push(row);
		}

		return {
			matrix,
			container
		};
	}

	_getCell(x, y, cellType) {
		const cell = {
			position: new Vector2(x, y),
			sprite: this._getCellSprite(x, y, cellType),
			type: cellType
		};

		return cell;
	}

	_getCellSprite(x, y, mapCell) {
		const sprite = new PIXI.Sprite(
			PIXI.loader.resources[MapCellSprite[mapCell]].texture
		);

		sprite.width = Constants.CellSize;
		sprite.height = Constants.CellSize;

		sprite.position.set(x * Constants.CellSize, y * Constants.CellSize);

		return sprite;
	}
}
