import EventEmitter from "./EventEmitter.js";

class Pagination extends EventEmitter {
	_root = null;
	_pages = 1;
	_page = 1;

	constructor(root, pages, page) {
		super();

		this._root = root;
		this._pages = pages;
		this._page = page;

		this.update();
	}

	get page() {
		return this._page;
	}

	get pages() {
		return this._pages;
	}

	set page(page) {
		this._page = page;
		this.update();
	}

	set pages(pages) {
		this._pages = pages;
		this.update();
	}

	update() {
		this._root.textContent = '';

		const ul = document.createElement('ul');
		ul.classList.add('pagination__container');
		this._root.append(ul);

		const back = document.createElement('li');
		back.textContent = 'Назад';
		back.classList.add('pagination__item', 'btn');
		ul.append(back);

		if (this._page === 1) {
			back.classList.add("disabled");
		}

		back.addEventListener('click', () => {
			this.emit('move', this._page - 1);
		});

		for (let i = 1; i <= this._pages; i++) {
			const li = document.createElement('li');
			li.classList.add('pagination__item');
			li.textContent = i;

			ul.append(li);

			if (i === this._page) {
				li.classList.add('_active');
			}

			li.addEventListener('click', () => {
				this.emit('move', i);
			});
		}

		const next = document.createElement('li');
		next.textContent = 'Вперед';
		next.classList.add('pagination__item', 'btn');
		ul.append(next);

		if (this._page === this._pages) {
			next.classList.add("disabled");
		}

		next.addEventListener('click', () => {
			this.emit('move', this._page + 1);
		});
	}
}

export default Pagination;