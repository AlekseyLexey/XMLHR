import Pagination from "./Classes/Pagination.js";

const add = document.querySelector('button[data-action="add"]');
const del = document.querySelector('button[data-action="delete"]');
const edit = document.querySelector('button[data-action="edit"]');

const getRandomAge = () => Math.round(10 + (Math.random() * 70));

const xhr = new XMLHttpRequest();
const urlUsers = new URL('http://localHost:3000/users');
const urlUsersSearch = new URL('http://localHost:3000/users');
const urlUsersCount = new URL('http://localHost:3000/usersCount');
urlUsersSearch.searchParams.set('limit', 2);
urlUsersSearch.searchParams.set('offset', 0);

const pagination = new Pagination(
	document.querySelector('[data-root="paginationRoot"]'),
);

getUsersCount();

function getUsersCount() {
	xhr.open('GET', urlUsersCount);

	xhr.onload = () => {
		pagination.page = 1;
		pagination.pages = Math.ceil(xhr.response.count / 2);

		initUsers('[data-root="listRoot"]');

		pagination.on('move', number => {

			urlUsersSearch.searchParams.set('offset', 2 * (number - 1));
			pagination.page = number;
			initUsers('[data-root="listRoot"]');
		});
	};

	xhr.responseType = 'json';
	xhr.send();
}

function initUsers(dRoot) {
	const root = document.querySelector(dRoot);

	xhr.open('GET', urlUsersSearch);

	xhr.onload = () => {
		console.log('fired');
		if (!root.querySelector('ul')) {
			const ul = document.createElement('ul');
			root.append(ul);
		
			const users = xhr.response;
	
			for (const user of users) {
				const li = document.createElement('li');
			
				li.textContent = user.name;
				ul.append(li);
			}
		} else {
			const allLi = root.querySelectorAll('ul > li');
	
			for (const li of allLi) {
				li.remove();
			}

			const users = xhr.response;
	
			for (const user of users) {
				const li = document.createElement('li');
			
				li.textContent = user.name;
				root.querySelector('ul').append(li);
			}
		}
	};

	xhr.responseType = 'json';
	xhr.send();
}

function setPaginationCount() {
	xhr.open('GET', urlUsersCount);

	xhr.onload = () => {
		pagination.pages = Math.ceil(xhr.response.count / 2);
		pagination.page = Math.min(pagination.page, pagination.pages)
	}

	xhr.responseType = 'json';
	xhr.send();
}

add.addEventListener('click', async () => {
	const inp = document.querySelector('input[data-value="name"]');
	if (inp.value) {

		xhr.open('POST', urlUsers);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

		console.log(JSON.stringify({
			name: `${inp.value}`,
			age: `${getRandomAge()}`
		}));
	
		xhr.send(
			JSON.stringify({
				name: `${inp.value}`,
				age: `${getRandomAge()}`
			})
		);

		inp.value = '';
	
		initUsers('[data-root="listRoot"]');

		setPaginationCount();
	}
});

del.addEventListener('click', async () => {
	const inp = document.querySelector('input[data-value="id"]');
	if (inp.value) {
		const urlD = `${urlUsers}/${inp.value}`;

		xhr.open('DELETE', urlD);
	
		xhr.send();

		inp.value = '';

		initUsers('[data-root="listRoot"]');

		setPaginationCount();
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

		xhr.open('PATCH', urlP);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	
		xhr.send(
			JSON.stringify(editUser)
		);

		inp.value = '';

		for (const item of edit) {
			item.value = '';
		}
	
		initUsers('[data-root="listRoot"]');
	}
});