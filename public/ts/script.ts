const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
	console.log('Connected to server successfully');
};

socket.onclose = (event) => {
	console.log(`Отключение с кодом: ${event.code}\nПричина:${event.reason}`);
};

socket.onerror = (err) => {
	console.log(`Ошибка: ${err}`);
};

socket.onmessage = (message) => {
	console.log(JSON.parse(message.data));
};

function sendData(data: string): void {
	if (!socket.readyState) {
		setTimeout(() => {
			sendData(data);
		}, 100);
	} else {
		socket.send(data);
	}
}

function joinGame(code: string): void {
	let data = {
		type: 'joinGame',
		code: code,
	};

	sendData(JSON.stringify(data));
}

function createGame(): void {
	let data = {
		type: 'createGame',
		code: makeCode(),
	};

	sendData(JSON.stringify(data));
}

function startGame(code: string): void {
	let data = {
		type: 'startGame',
		code: code,
	};

	sendData(JSON.stringify(data));
}

let codez;

function makeCode(): string {
	let code = '';
	let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

	for (let i = 0; i < 4; i++) {
		code += symbols[Math.floor(Math.random() * symbols.length)];
	}

	codez = code;

	return code;
}
