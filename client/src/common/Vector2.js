export default class Vector2 {
	x = 0;
	y = 0;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;

		return this;
	}

	equals(v) {
		return this.x === v.x && this.y === v.y;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;

		return this;
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}

	multiplyScalar(n) {
		this.x *= n;
		this.y *= n;

		return this;
	}

	sgn() {
		if (this.x !== 0) {
			this.x /= Math.abs(this.x);
		}

		if (this.y !== 0) {
			this.y /= Math.abs(this.y);
		}

		return this;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;

		return this;
	}
}
