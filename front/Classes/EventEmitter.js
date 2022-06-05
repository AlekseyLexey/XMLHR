class EventEmitter {
	_handlers = new Map;

	addEventListener(key, value) {
		if (!this._handlers.has(key)) {
			this._handlers.set(key, new Set());

			this._handlers.get(key).add(value)
		}
	}

	on(...args) {
		return this.addEventListener(...args);
	}

	get handlers() {
		return this._handlers;
	}

	emit(key, ...data) {
		if (this._handlers.has(key)) {
			for (const handler of this._handlers.get(key)) {
				handler(...data);
			}
		}
	}
}

export default EventEmitter;