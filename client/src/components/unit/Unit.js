import * as PIXI from "pixi.js";

import Constants from "common/Constants";
import Vector2 from "common/Vector2";

export default class Unit {
	selected = false;
	position = new Vector2(0, 0);
	spritePosition = new Vector2(0, 0);
	direction = new Vector2(1, 1);
	tint = 0xffffff;
	spriteAtlas = PIXI.loader.resources["harvester"].textures;

	constructor(container) {
		this.container = container;
	}

	init() {
		this._initUnitSprite();
		this._initSelectionSprite();
	}

	destroy() {
		this.container.removeChild(this.sprite);
	}

	setSpritePosition(spritePosition) {
		this.spritePosition = spritePosition;
		this.sprite.position.set(this.spritePosition.x, this.spritePosition.y);
	}

	setSpriteDirection(direction) {
		this.direction = direction;
		this.sprite.texture = this.spriteAtlas[`${direction.x} ${direction.y}`];
	}

	setTint(tint) {
		this.tint = tint;
		this.sprite.tint = tint;
	}

	select() {
		this.selected = true;
		this.selectionSprite.visible = true;
	}

	deselect() {
		this.selected = false;
		this.selectionSprite.visible = false;
	}

	_initUnitSprite() {
		const sprite = new PIXI.Sprite(this.spriteAtlas["1 1"]);

		sprite.width = Constants.CellSize;
		sprite.height = Constants.CellSize;

		this.container.addChild(sprite);
		this.sprite = sprite;
	}

	_initSelectionSprite() {
		const sprite = new PIXI.Sprite(PIXI.loader.resources["selection"].texture);

		sprite.width = Constants.CellSize;
		sprite.height = Constants.CellSize;
		sprite.visible = false;

		this.sprite.addChild(sprite);
		this.selectionSprite = sprite;
	}
}
