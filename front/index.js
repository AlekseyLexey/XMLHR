const add = document.querySelector('button[data-action="add"]');
const del = document.querySelector('button[data-action="delete"]');
const edit = document.querySelector('button[data-action="edit"]');

const urlUsers = new URL('http://localHost:3000/users');

function getUsersCount() {
	const xhrG = new XMLHttpRequest();

	const urlUsersCount = new URL('http://localHost:3000/usersCount');

	xhrG.open('GET', urlUsersCount);

	xhrG.onload = () => {
		console.log(xhrG.response.count);
	};

	xhrG.responseType = 'json';
	xhrG.send();
}

initUsers();

const getRandomAge = () => Math.round(10 + (Math.random() * 70));

function initUsers() {
	const xhrG = new XMLHttpRequest();

	xhrG.open('GET', urlUsers);

	if (!document.querySelector('ul')) {
		const ul = document.createElement('ul');
		document.body.append(ul);
	
		xhrG.onload = () => {
			const users = xhrG.response;
	
			for (const user of users) {
				const li = document.createElement('li');
			
				li.textContent = user.name;
				ul.append(li);
			}
		};
	} else {
		const allLi = document.querySelectorAll('ul > li');

		for (const li of allLi) {
			li.remove();
		}

		xhrG.onload = () => {
			const users = xhrG.response;
	
			for (const user of users) {
				const li = document.createElement('li');
			
				li.textContent = user.name;
				document.querySelector('ul').append(li);
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
	
		await initUsers();
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
	
		await initUsers();
	}
});

edit.addEventListener('click', async () => {
	const inp = document.querySelector('input[data-value="edit"]');
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
	
		await initUsers();
	}
});