const Constants = require("../../common/Constants");
const Vector2 = require("../../common/Vector2");

class MapBuilder {
	constructor() {
		this.rng = new Math.seedrandom("harvester");
	}

	build() {
		const matrix = [];

		for (let i = 0; i < Constants.GridWidth; i++) {
			const row = [];

			for (let j = 0; j < Constants.GridHeight; j++) {
				let cellType = ".";
				if (i > 0 && j > 0 && this.rng() < 0.25) {
					cellType = "x";
				}

				const cell = this._getCell(j, i, cellType);
				row.push(cell);
			}

			matrix.push(row);
		}

		return matrix;
	}

	_getCell(x, y, cellType) {
		const cell = {
			position: new Vector2(x, y),
			blocked: cellType === "x",
			type: cellType
		};

		return cell;
	}
}

module.exports = MapBuilder;
