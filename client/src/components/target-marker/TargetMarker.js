import * as PIXI from "pixi.js";

import Constants from "common/Constants";
import Vector2 from "common/Vector2";

const AnimationFrames = 30;
const ScaleDelta = 1 / AnimationFrames;
const Offset = new Vector2(Constants.CellSize / 2, Constants.CellSize / 2);

export default class TargetMarker {
	animationCooldown = 0;
	scale = 1;
	rotation = 0;
	active = false;

	constructor(container) {
		this.container = container;
	}

	init() {
		this._initSprite();
	}

	update() {
		if (!this.active) {
			return;
		}

		if (this.animationCooldown > 0) {
			this.animationCooldown--;

			this.scale -= ScaleDelta;
			this.sprite.scale.set(this.scale, this.scale);

			this.rotation += 0.1;
			this.sprite.rotation = this.rotation;

			if (this.animationCooldown === 0) {
				this.active = false;
				this.sprite.visible = false;
			}
		}
	}

	activate(position) {
		this.active = true;
		this.scale = 1;
		this.rotation = 0;
		this.animationCooldown = AnimationFrames;

		const spritePosition = position.clone().multiplyScalar(Constants.CellSize).add(Offset);

		this.sprite.scale.set(this.scale, this.scale);
		this.sprite.rotation = this.rotation;
		this.sprite.position.set(spritePosition.x, spritePosition.y);
		this.sprite.visible = true;
	}

	_initSprite() {
		const sprite = new PIXI.Sprite(
			PIXI.loader.resources["marker"].texture
		);

		sprite.width = Constants.CellSize;
		sprite.height = Constants.CellSize;

		sprite.tint = 0xff0000;
		sprite.anchor.set(0.5, 0.5);
		sprite.visible = false;

		this.container.addChild(sprite);
		this.sprite = sprite;
	}
}
