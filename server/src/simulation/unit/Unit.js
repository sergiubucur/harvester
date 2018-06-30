const Vector2 = require("../../common/Vector2");
const Constants = require("../../common/Constants");
const UnitCollisionHelper = require("./UnitCollisionHelper");

const TurnFrames = 64;
const Speed = 64 / TurnFrames;

class Unit {
	constructor(position, collisionMap) {
		this.position = position;
		this.collisionMap = collisionMap;

		this.targetPosition = null;
		this.nextPosition = null;
		this.velocity = null;
		this.direction = new Vector2(1, 1);
		this.turnCooldown = 1;

		this.spritePosition = this.position.clone().multiplyScalar(Constants.CellSize);
	}

	init() {
		this.collisionMap.setCellBlocked(this.position, true);
	}

	destroy() {
		this.collisionMap.setCellBlocked(this.position, false);
	}

	update() {
		if (this.turnCooldown > 0) {
			this.turnCooldown--;

			this._move();
			if (this.turnCooldown === 0) {
				this.turnCooldown = TurnFrames;
				this._think();
			}
		}
	}

	goTo(position) {
		this.targetPosition = position;

		if (!this.velocity) {
			this.turnCooldown = 1;
		}
	}

	getSnapshot() {
		return {
			position: this.position,
			spritePosition: this.spritePosition,
			direction: this.direction
		};
	}

	_think() {
		if (!this.targetPosition) {
			return;
		}

		if (this.nextPosition) {
			this.collisionMap.setCellBlocked(this.position, false);
			this.position.copy(this.nextPosition);
		}

		if (!this.position.equals(this.targetPosition)) {
			let delta = this.targetPosition.clone().sub(this.position).sgn();

			if (UnitCollisionHelper.handleCollision(this.position, delta, this.collisionMap)) {
				this.nextPosition = this.position.clone().add(delta);
				this.collisionMap.setCellBlocked(this.nextPosition, true);

				this.velocity = delta;
				this.direction.copy(delta);
			} else {
				this._resetMovement();
			}
		} else {
			this._resetMovement();
		}
	}

	_resetMovement() {
		this.targetPosition = null;
		this.nextPosition = null;
		this.velocity = null;
	}

	_move() {
		if (!this.nextPosition) {
			return;
		}

		this.spritePosition.add(this.velocity.clone().multiplyScalar(Speed));
	}
}

module.exports = Unit;
