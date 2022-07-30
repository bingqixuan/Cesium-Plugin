/*
 * @Description: 右键菜单
 * @Author: Jin（https://github.com/ElevenIjusee?tab=repositories）
 * @Date: 2022-04-27 13:30:05
 * @LastEditors: Jin
 * @LastEditTime: 2022-04-27 22:15:24
 */
// @ts-nocheck
export default class ContextMenu {

	private menu: I_list;
	private options;
	private self;
	private num: number;
	public count: number = 0;
	private contextTarget;
	// public DIVIDER;

	constructor(menu, options={}) {
		this.self = this;
		this.num = this.count++;
		this.menu = menu;
		this.contextTarget = null;
		this.options = options;

		if (!(menu instanceof Array)) {
			throw new Error("Parameter 1 must be of type Array");
		};

		if (typeof options !== "undefined") {
			if (typeof options !== "object") {
				throw new Error("Parameter 2 must be of type object");
			}
		} else {
			options = {};
		};

		window.addEventListener("resize", ()=> {
			if (ContextUtil.getProperty(options, "close_on_resize", true)) {
				this.hide();
			}
		});

		this.reload();
	};

	public setOptions(_options): void {
		if (typeof _options === "object") {
			this.options = _options;
		} else {
			throw new Error("Parameter 1 must be of type object")
		}
	};

	public changeOption(option, value): void {
		if (typeof option === "string") {
			if (typeof value !== "undefined") {
				this.options[option] = value;
			} else {
				throw new Error("Parameter 2 must be set");
			}
		} else {
			throw new Error("Parameter 1 must be of type string");
		}
	}

	public getOptions(): any {
		return this.options;
	}

	public reload() {
		if (document.getElementById('cm_' + this.num) == null) {
			let cnt = document.createElement("div");
			cnt.className = "cm_container";
			cnt.id = "cm_" + this.num;

			document.body.appendChild(cnt);
		}

		let container = document.getElementById('cm_' + this.num);
		container.innerHTML = "";

		container.appendChild(this.renderLevel(this.menu));
	}

	public renderLevel(level): HTMLElement{
		const _this = this;
		let ul_outer = document.createElement("ul");

		level.forEach(function (item) {
			let li = document.createElement("li") as any;
			li.menu = _this.self;

			if (typeof item.type === "undefined") {
				let icon_span = document.createElement("span");
				icon_span.className = 'cm_icon_span';

				if (ContextUtil.getProperty(item, "icon", "") != "") {
					icon_span.innerHTML = ContextUtil.getProperty(item, "icon", "");
				} else {
					icon_span.innerHTML = ContextUtil.getProperty(_this.options, "default_icon", "");
				}

				let text_span = document.createElement("span");
				text_span.className = 'cm_text';

				if (ContextUtil.getProperty(item, "text", "") != "") {
					text_span.innerHTML = ContextUtil.getProperty(item, "text", "");
				} else {
					text_span.innerHTML = ContextUtil.getProperty(_this.options, "default_text", "item");
				}

				let sub_span = document.createElement("span");
				sub_span.className = 'cm_sub_span';

				if (typeof item.sub !== "undefined") {
					if (ContextUtil.getProperty(_this.options, "sub_icon", "") != "") {
						sub_span.innerHTML = ContextUtil.getProperty(_this.options, "sub_icon", "");
					} else {
						sub_span.innerHTML = '&#155;';
					}
				}

				li.appendChild(icon_span);
				li.appendChild(text_span);
				li.appendChild(sub_span);

				if (!ContextUtil.getProperty(item, "enabled", true)) {
					li.setAttribute("disabled", "");
				} else {
					if (typeof item.events === "object") {
						let keys = Object.keys(item.events);

						for (let i = 0; i < keys.length; i++) {
							li.addEventListener(keys[i], item.events[keys[i]]);
						}
					}

					if (typeof item.sub !== "undefined") {
						li.appendChild(_this.renderLevel(item.sub));
					}
				}
			} else {
				if (item.type === "cm_divider") {
					li.className = "cm_divider";
				}
			}

			ul_outer.appendChild(li);
		});

		return ul_outer;
	}

	public display(e, target?: any): void {
		if (typeof target !== "undefined") {
			this.contextTarget = target;
		} else {
			this.contextTarget = e.target;
		}

		let menu = document.getElementById('cm_' + this.num);

		let clickCoords = { x: e.clientX, y: e.clientY };
		let clickCoordsX = clickCoords.x;
		let clickCoordsY = clickCoords.y;

		let menuWidth = menu.offsetWidth + 4;
		let menuHeight = menu.offsetHeight + 4;

		let windowWidth = window.innerWidth;
		let windowHeight = window.innerHeight;

		let mouseOffset = parseInt(ContextUtil.getProperty(this.options, "mouse_offset", 2));

		if ((windowWidth - clickCoordsX) < menuWidth) {
			menu.style.left = windowWidth - menuWidth + "px";
		} else {
			menu.style.left = (clickCoordsX + mouseOffset) + "px";
		}

		if ((windowHeight - clickCoordsY) < menuHeight) {
			menu.style.top = windowHeight - menuHeight + "px";
		} else {
			menu.style.top = (clickCoordsY + mouseOffset) + "px";
		}

		let sizes = ContextUtil.getSizes(menu);

		if ((windowWidth - clickCoordsX) < sizes.width) {
			menu.classList.add("cm_border_right");
		} else {
			menu.classList.remove("cm_border_right");
		}

		if ((windowHeight - clickCoordsY) < sizes.height) {
			menu.classList.add("cm_border_bottom");
		} else {
			menu.classList.remove("cm_border_bottom");
		}

		menu.classList.add("display");

		if (ContextUtil.getProperty(this.options, "close_on_click", true)) {
			window.addEventListener("click", this.documentClick.bind(this));
		}

		// e.preventDefault();
	}

	public hide(): void {
		document.getElementById('cm_' + this.num).classList.remove("display");
		window.removeEventListener("click", this.documentClick.bind(this));
	}

	public documentClick(): void {
		this.hide();
	}
};

// ContextMenu.count = 0;
// ContextMenu.DIVIDER = "cm_divider";

const ContextUtil = {
	getProperty: function (options, opt, def) {
		if (typeof options[opt] !== "undefined") {
			return options[opt];
		} else {
			return def;
		}
	},

	getSizes: function (obj) {
		let lis = obj.getElementsByTagName('li');

		let width_def = 0;
		let height_def = 0;

		for (let i = 0; i < lis.length; i++) {
			let li = lis[i];

			if (li.offsetWidth > width_def) {
				width_def = li.offsetWidth;
			}

			if (li.offsetHeight > height_def) {
				height_def = li.offsetHeight;
			}
		}

		let width = width_def;
		let height = height_def;

		for (let i = 0; i < lis.length; i++) {
			let li = lis[i];

			let ul = li.getElementsByTagName('ul');
			if (typeof ul[0] !== "undefined") {
				let ul_size = ContextUtil.getSizes(ul[0]);

				if (width_def + ul_size.width > width) {
					width = width_def + ul_size.width;
				}

				if (height_def + ul_size.height > height) {
					height = height_def + ul_size.height;
				}
			}
		}

		return {
			"width": width,
			"height": height
		};
	}
};
