const Vector2 = require("../common/Vector2");
const Constants = require("../common/Constants");
const MapBuilder = require("./map-builder/MapBuilder");
const CollisionMap = require("./unit/CollisionMap");
const Unit = require("./unit/Unit");

class Simulation {
	constructor() {
		this.users = [];
		this.matrix = null;

		this.colors = Constants.Colors.map(x => {
			return {
				color: x,
				used: false
			};
		});

		this.onUpdate = () => {};
	}

	init() {
		this._initMatrix();

		setInterval(() => {
			this._update();
		}, Constants.UpdateIntervalMs);
	}

	addUser(userId) {
		if (this.users.length === Constants.MaxUsers) {
			return;
		}

		const position = this._getFreeMatrixPosition();
		const unit = new Unit(position, this.collisionMap);
		unit.init();

		const color = this._getFreeColor();
		this._setColorUsed(color, true);

		const user = {
			id: userId,
			units: [unit],
			color
		};

		this.users.push(user);
	}

	removeUser(userId) {
		const index = this.users.findIndex(x => x.id === userId);
		if (index > -1) {
			const user = this.users[index];
			this._setColorUsed(user.color, false);

			user.units.forEach(unit => {
				this.collisionMap.setCellBlocked(unit.position, false);
			});

			this.users.splice(index, 1);
		}
	}

	unitGoTo(userId, position) {
		const user = this.users.find(x => x.id === userId);

		if (user) {
			const unit = user.units[0];
			unit.goTo(new Vector2(position.x, position.y));
		}
	}

	getSnapshot() {
		const units = [];

		this.users.forEach(user => {
			user.units.forEach(unit => {
				const unitSnapshot = unit.getSnapshot();
				unitSnapshot.userId = user.id;
				unitSnapshot.color = user.color;

				units.push(unitSnapshot);
			});
		});

		return units;
	}

	_update() {
		this.users.forEach(user => {
			user.units.forEach(unit => {
				unit.update();
			});
		});

		this.onUpdate();
	}

	_initMatrix() {
		const mapBuilder = new MapBuilder();

		this.matrix = mapBuilder.build();
		this.collisionMap = new CollisionMap(this.matrix);
	}

	_getFreeMatrixPosition() {
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (!this.matrix[i][j].blocked) {
					return new Vector2(j, i);
				}
			}
		}

		throw new Error("no free matrix positions available");
	}

	_getFreeColor() {
		return this.colors.find(x => !x.used).color;
	}

	_setColorUsed(color, value) {
		this.colors.find(x => x.color === color).used = value;
	}
}

module.exports = Simulation;
