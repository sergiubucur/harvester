class CollisionMap {
	constructor(matrix) {
		this.matrix = matrix;
	}

	isCellBlocked(position) {
		return this.matrix[position.y][position.x].blocked;
	}

	setCellBlocked(position, value) {
		this.matrix[position.y][position.x].blocked = value;
	}
}

module.exports = CollisionMap;
