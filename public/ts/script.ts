// import { Player, Card } from './../../src/models';

const socket = new WebSocket('ws://localhost:3000');

interface requestData {
	type: 'event' | 'request' | 'response';
	name: string;
	body: Object;
}

interface gamePrototype {
	players?: string[];
	lastCard?: Object;
	code?: string;
}

function sendData(data: requestData): void {
	if (!socket.readyState) {
		setTimeout(() => {
			sendData(data);
		}, 100);
	} else {
		socket.send(JSON.stringify(data));
	}
}

let player: Player;

document.querySelector('#submitName')?.addEventListener('click', (e) => {
	const playerName = document.getElementById('playerName') as HTMLInputElement;

	if (player) return alert('Вы уже указали имя!');
	player = new Player(socket, playerName.value);
});

document.querySelector('#createGame')?.addEventListener('click', (e) => {
	player.game.code = (
		document.getElementById('gameCode') as HTMLInputElement
	).value;

	if (!player) return alert('Вы не указали имя!');
	if (!player.game.code) return alert('Вы не указали код!');

	player.createGame(player.game.code, player.name);
});

document.querySelector('#joinGame')?.addEventListener('click', (e) => {
	player.game.code = (
		document.getElementById('gameCode') as HTMLInputElement
	).value;

	if (!player) return alert('Вы не указали имя!');
	if (!player.game.code) return alert('Вы не указали код!');

	player.joinGame(player.game.code, player.name);
});

class Player {
	socket: WebSocket;
	name: string;
	cards: object[];
	game: gamePrototype;

	constructor(socket: WebSocket, name: string) {
		this.socket = socket;

		this.name = name;
		this.cards = [];

		this.game = {
			code: undefined,
			players: [],
			lastCard: {},
		};
	}

	createGame(code: string, name: string) {
		let requestData = {
			type: 'createGame',
			body: {
				name: name,
				code: code,
			},
		};

		sendData(requestData);
	}

	joinGame(code: string, name: string) {
		let requestData = {
			type: 'joinGame',
			body: {
				name: name,
				code: code,
			},
		};

		sendData(requestData);
	}

	startGame() {
		if (!this.name || !this.game.code) return;

		let requestData = {
			type: 'createGame',
			body: {
				name: this.name,
				code: this.game.code,
			},
		};

		sendData(requestData);
	}
}

socket.onopen = () => {
	console.log('Connected to server successfully');
};

socket.onclose = (event) => {
	console.log(`Отключение с кодом: ${event.code}\nПричина:${event.reason}`);
};

socket.onerror = (err) => {
	console.log(`Ошибка: ${err}`);
};

interface messageHandler {
	[key: string]: any
}

const handleMessage: messageHandler = {
	event: {}
	request: {},
	response: {},
};

socket.onmessage = (message) => {
	const res: requestData = JSON.parse(message.data);

	if ((res.type = 'event')) {
		handleMessage.event.hasOwnProperty(res.name) ? handleMessage.event[res.name];
	} else if ((res.type = 'request')) {
	} else if ((res.type = 'response')) {
	}
};

function getCards() {}
function getLastCard() {}
function getPlayers() {}
function unknownHandler() {}
