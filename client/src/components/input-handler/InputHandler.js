import Vector2 from "common/Vector2";

export default class InputHandler {
	mouseDown = false;
	mouseDownTime = Date.now();
	click = false;
	mousePosition = new Vector2();
	oldMousePosition = new Vector2();
	mouseDelta = new Vector2();

	init() {
		this._initMouseEvents();
		this._initTouchEvents();
	}

	_initMouseEvents() {
		document.addEventListener("mousedown", (e) => {
			this.mouseDown = true;
			this.mouseDownTime = Date.now();
			this.mouseDelta.set(0, 0);
		});

		document.addEventListener("mouseup", (e) => {
			if (Date.now() - this.mouseDownTime < 100) {
				this.click = true;
			}

			this.mouseDown = false;
			this.mouseDelta.set(0, 0);
		});

		document.addEventListener("mousemove", (e) => {
			this.mousePosition.set(e.pageX, e.pageY);
			this.mouseDelta.copy(this.mousePosition).sub(this.oldMousePosition);
			this.oldMousePosition.copy(this.mousePosition);
		});
	}

	_initTouchEvents() {
		document.addEventListener("touchstart", (e) => {
			this.mouseDown = true;
			this.mouseDownTime = Date.now();
			this.mouseDelta.set(0, 0);

			const touch = e.touches[0];
			this.mousePosition.set(touch.pageX, touch.pageY);
			this.oldMousePosition.copy(this.mousePosition);
		});

		document.addEventListener("touchend", (e) => {
			if (Date.now() - this.mouseDownTime < 100) {
				this.click = true;
			}

			this.mouseDown = false;
			this.mouseDelta.set(0, 0);
		});

		document.addEventListener("touchmove", (e) => {
			const touch = e.touches[0];

			this.mousePosition.set(touch.pageX, touch.pageY);
			this.mouseDelta.copy(this.mousePosition).sub(this.oldMousePosition);
			this.oldMousePosition.copy(this.mousePosition);
		});
	}
}
