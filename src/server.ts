const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

let sockets: Object = {};

class Player {
	socket: any;
	cards: Object[];

	constructor(socket: any) {
		this.socket = socket;
		this.cards = [];
	}

	takeCard() {
		// this.cards.push(...)
	}
}

class Game {
	code: string;
	players: Object[];
	host: any;
	started: boolean;
	deck: Object[];

	constructor(code: string, firstPlayer: any) {
		this.code = code;

		this.players = [firstPlayer];
		this.host = firstPlayer;

		this.started = false;

		this.deck = [];

		// Добавление карт с цифрами
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 4; j++) {
				for (let k = 2; k > 0; k--) {
					this.deck.push({
						color: ['red', 'yellow', 'blue', 'green'][j],
						number: i,
						type: 'number',
					});
				}
			}
		}

		// Добавление уникальных карт
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 3; j++) {
				for (let k = 2; k > 0; k--) {
					this.deck.push({
						color: ['red', 'yellow', 'blue', 'green'][i],
						type: ['reverse', 'skip', 'taketwo'][j],
					});
				}
			}
		}

		for (let i = 0; i < 4; i++) {
			this.deck.push({
				type: 'choice',
			});
		}
	}

	addPlayer(socket: any): void {
		if (!this.started) this.players.push(new Player(socket));
	}

	generateCard(): object {
		let index = randomNumber(0, this.deck.length - 1);
		let card = this.deck[index];
		delete this.deck[index];
		return card;
	}

	start(): void {}
}

function randomNumber(min: number, max: number): number {
	return Math.floor(min + Math.random() * (max - min));
}

/*
number - обычная карта со значением от 0 до 9.
reverse - меняет направление
skip - следующий игрок пропускает ход
taketwo - следующий игрок берёт 2 карты
choice - ты выбираешь цвет

type Color = 'red' | 'yellow' | 'blue' | 'green';
type CardType = 'number' | 'reverse' | 'skip' | 'taketwo' | 'choice';
type CardValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Card {
  color?: Color,
  type: CardType,
  value?: CardValue
}

interface NumberCard {
  color: Color,
  type: 'number',
  value: CardValue
}
*/

const { WebSocketServer } = require('ws');
const wsserver = new WebSocketServer({
	server: server,
});

app.use(express.static('public'));

app.get('/', (req: any, res: any) => {
	res.sendFile(__dirname + '/index.html');
});

wsserver.on('connection', (socket: any) => {
	socket.on('message', (data:any) => {
		console.log(`Received data: ${data}`);
	});
});

server.listen('3000', () => {
	console.log('Server is listening at port 3000');
});
