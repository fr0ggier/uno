import { Player, Card } from './../../src/models';

const socket = new WebSocket('ws://localhost:3000');

let cards: Card[] = [];
let lastCard: Card;
let players: Player[] = [];
// let turn:

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
	const res = JSON.parse(message.data);

	if (res.type == 'getCards') {
		cards = res.body;
	} else if (res.type == 'getLastCard') {
		lastCard = res.body;
	} else if (res.type == 'getPlayers') {
		players = res.body;
	}
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

function joinGame(code: string, name: string): void {
	let data = {
		type: 'joinGame',
		body: { code: code, name: name },
	};

	sendData(JSON.stringify(data));
}

function createGame(name: string): void {
	let data = {
		type: 'createGame',
		body: { code: makeCode(), name: name },
	};

	sendData(JSON.stringify(data));
}

function startGame(code: string): void {
	let data = {
		type: 'startGame',
		body: { code: code },
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
