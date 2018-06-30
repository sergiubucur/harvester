import Constants from "common/Constants";
import Vector2 from "common/Vector2";

import MapBuilder from "components/map-builder/MapBuilder";
import Unit from "components/unit/Unit";
import TargetMarker from "components/target-marker/TargetMarker";
import UnitDiffHelper from "./UnitDiffHelper";

export default class Grid {
	serverUpdates = [];

	viewportOrigin = new Vector2();
	hoverCell = null;

	userId = null;
	units = [];
	selectedUnit = null;

	onUnitGoTo = () => {};

	constructor(pixiApp, input) {
		this.pixiApp = pixiApp;
		this.input = input;
	}

	init() {
		this._initMatrix();
		this._initTargetMarker();
	}

	update() {
		this._processServerUpdates();
		this._computeHoverCell();
		this._updateInput();

		this.targetMarker.update();
	}

	onServerUpdate(userId, data) {
		this.userId = userId;
		this.serverUpdates.unshift(data);
	}

	_processServerUpdates() {
		while (this.serverUpdates.length > 0) {
			const data = this.serverUpdates.pop();
			const diff = UnitDiffHelper.diffUnits(this.units, data);

			diff.added.forEach(unitInfo => {
				const unit = new Unit(this.container);
				unit.init();

				unit.userId = unitInfo.userId;
				unit.position = new Vector2(unitInfo.position.x, unitInfo.position.y);
				unit.setTint(unitInfo.color);
				unit.setSpritePosition(new Vector2(unitInfo.spritePosition.x, unitInfo.spritePosition.y));
				unit.setSpriteDirection(new Vector2(unitInfo.direction.x, unitInfo.direction.y));

				this.units.push(unit);
			});

			diff.modified.forEach(data => {
				const unit = data.unit;
				const unitInfo = data.unitInfo;

				unit.position = new Vector2(unitInfo.position.x, unitInfo.position.y);
				unit.setTint(unitInfo.color);
				unit.setSpritePosition(new Vector2(unitInfo.spritePosition.x, unitInfo.spritePosition.y));
				unit.setSpriteDirection(new Vector2(unitInfo.direction.x, unitInfo.direction.y));
			});

			diff.deleted.forEach(unit => {
				unit.destroy();

				const index = this.units.indexOf(unit);
				this.units.splice(index, 1);
			});
		}
	}

	_initMatrix() {
		const mapBuilder = new MapBuilder();
		const result = mapBuilder.build();

		this.matrix = result.matrix;
		this.container = result.container;

		this.pixiApp.stage.addChild(this.container);
	}

	_initTargetMarker() {
		this.targetMarker = new TargetMarker(this.container);
		this.targetMarker.init();
	}

	_updateInput() {
		if (this.input.mouseDown) {
			this.viewportOrigin.add(this.input.mouseDelta);
			this.input.mouseDelta.set(0, 0);

			this.container.position.set(this.viewportOrigin.x, this.viewportOrigin.y);
		}

		if (this.input.click) {
			this.input.click = false;

			if (this.hoverCell) {
				const unit = this._findUnitByPosition(this.hoverCell.position);

				if (unit) {
					if (this.selectedUnit) {
						this.selectedUnit.deselect();
					}

					if (this.selectedUnit === unit || unit.userId !== this.userId) {
						this.selectedUnit = null;
					} else {
						this.selectedUnit = unit;
						this.selectedUnit.select();
					}
				} else {
					if (this.selectedUnit) {
						this.onUnitGoTo(this.hoverCell.position);
						this.targetMarker.activate(this.hoverCell.position);
					}
				}
			}
		}
	}

	_findUnitByPosition(position) {
		return this.units.find(x => x.position.equals(position));
	}

	_computeHoverCell() {
		const x = Math.floor((this.input.mousePosition.x - this.viewportOrigin.x) / Constants.CellSize);
		const y = Math.floor((this.input.mousePosition.y - this.viewportOrigin.y) / Constants.CellSize);

		if (x >= 0 && x < Constants.GridWidth && y >= 0 && y < Constants.GridHeight) {
			this.hoverCell = this.matrix[y][x];
			return;
		}

		this.hoverCell = null;
	}
}
