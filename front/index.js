import Pagination from "./Classes/Pagination.js";

const add = document.querySelector('button[data-action="add"]');
const del = document.querySelector('button[data-action="delete"]');
const edit = document.querySelector('button[data-action="edit"]');
const urlUsers = new URL('http://localHost:3000/users');

const urlUsersSearch = new URL('http://localHost:3000/users');
urlUsersSearch.searchParams.set('limit', 2);

const getRandomAge = () => Math.round(10 + (Math.random() * 70));

initUsers('[data-root="listRoot"]');
getUsersCount();

function getUsersCount() {
	const xhrG = new XMLHttpRequest();

	const urlUsersCount = new URL('http://localHost:3000/usersCount');

	xhrG.open('GET', urlUsersCount);

	xhrG.onload = () => {

		const pagination = new Pagination(
			document.querySelector('[data-root="paginationRoot"]'),
			Math.ceil(xhrG.response.count / 2),
			1
		);

		pagination.on('move', number => {

			urlUsersSearch.searchParams.set('offset', 2 * (number - 1));
			pagination.page = number;
			initUsers('[data-root="listRoot"]');
		});
	};

	xhrG.responseType = 'json';
	xhrG.send();
}


function initUsers(dRoot) {
	const xhrG = new XMLHttpRequest();
	const root = document.querySelector(dRoot);

	xhrG.open('GET', urlUsersSearch);

	if (!root.querySelector('ul')) {
		const ul = document.createElement('ul');
		root.append(ul);
	
		xhrG.onload = () => {
			const users = xhrG.response;
	
			for (const user of users) {
				const li = document.createElement('li');
			
				li.textContent = user.name;
				ul.append(li);
			}
		};
	} else {
		const allLi = root.querySelectorAll('ul > li');

		for (const li of allLi) {
			li.remove();
		}

		xhrG.onload = () => {
			const users = xhrG.response;
	
			for (const user of users) {
				const li = document.createElement('li');
			
				li.textContent = user.name;
				root.querySelector('ul').append(li);
			}
		};
	}

	xhrG.responseType = 'json';
	xhrG.send();
}


add.addEventListener('click', async () => {
	const inp = document.querySelector('input[data-value="name"]');
	if (inp.value) {
		const xhrAdd = new XMLHttpRequest();

		xhrAdd.open('POST', urlUsers);
		xhrAdd.setRequestHeader('Content-Type', 'application/json; charset = utf-8');
	
		await xhrAdd.send(
			JSON.stringify({
				name: `${inp.value}`,
				age: `${getRandomAge()}`
			})
		);

		inp.value = '';
	
		await initUsers('[data-root="listRoot"]');
	}
});

del.addEventListener('click', async () => {
	const inp = document.querySelector('input[data-value="id"]');
	if (inp.value) {
		const urlD = `${urlUsers}/${inp.value}`;
		const xhrAdd = new XMLHttpRequest();

		xhrAdd.open('DELETE', urlD);
	
		await xhrAdd.send();

		inp.value = '';
	
		await initUsers('[data-root="listRoot"]');
	}
});

edit.addEventListener('click', async () => {
	const inp = document.querySelector('input[data-value="editId"]');
	if (inp.value) {
		const urlP = `${urlUsers}/${inp.value}`;
		const edit = document.querySelectorAll('input[data-value="edit"]');
		const editUser = {};

		for (const item of edit) {
			if (item.value) {
				editUser[item.name] = item.value;
			}
		}
		const xhrAdd = new XMLHttpRequest();

		xhrAdd.open('PATCH', urlP);
		xhrAdd.setRequestHeader('Content-Type', 'application/json; charset = utf-8');
	
		await xhrAdd.send(
			JSON.stringify(editUser)
		);

		inp.value = '';

		for (const item of edit) {
			item.value = '';
		}
	
		await initUsers('[data-root="listRoot"]');
	}
});