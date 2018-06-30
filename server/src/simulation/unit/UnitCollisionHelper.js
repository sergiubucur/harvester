class UnitCollisionHelper {
	static handleCollision(position, delta, collisionMap) {
		let map = collisionMap;

		let d = delta.clone();
		let pos = position.clone().add(d);

		if (!map.isCellBlocked(pos)) {
			delta.copy(d);
			return true;
		}

		d.copy(delta);
		d.x = 0;
		pos.copy(position).add(d);

		if (!map.isCellBlocked(pos)) {
			delta.copy(d);
			return delta.x !== 0 || delta.y !== 0;
		}

		d.copy(delta);
		d.y = 0;
		pos.copy(position).add(d);

		if (!map.isCellBlocked(pos)) {
			delta.copy(d);
			return delta.x !== 0 || delta.y !== 0;
		}

		return false;
	}
}

module.exports = UnitCollisionHelper;
