const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

let sockets = {};

class Player {
	constructor(socket) {
		this.socket = socket;
		this.cards = [];
	}

	takeCard() {
		// this.cards.push(...)
	}
}

class Game {
	constructor(code, firstPlayer) {
		this.code = code;

		this.players = [firstPlayer];
		this.host = firstPlayer;

		this.started = false;

		this.deck = [];

		// добавляю карты с цифрами
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
	}

	addPlayer(socket) {
		if (!this.started) this.players.push(new Player(socket));
	}

	generateCard() {
		let index = randomNumber(0, this.deck.length - 1);
		let card = this.deck[index];
		delete deck[index];
		return card;
	}

	start() {}
}

/* function generateCard() {
  let card = {};

  if (randomNumber(1, 104) > 80) {
    switch (randomNumber(0, 3)) {
      case 0:
        card.type = 'taketwo'
        break
      case 1:
        card.type = 'reverse'
        break
      case 2:
        card.type = 'skip'
        break
      case 3:
        card.type = 'choice'
        break
    };
  } else {
    card.type = 'number';
    card.value = randomNumber(0, 9);
  };

  if (card.type !== 'choice') {
    switch (randomNumber(0, 3)) {
      case 0:
        card.color = 'red';
        break;
      case 1:
        card.color = 'green';
        break
      case 2:
        card.color = 'yellow';
        break;
      case 3:
        card.color = 'blue';
        break;
    };
  }

  return card;
}; */

function randomNumber(min, max) {
	return Math.floor(min + Math.random() * (max - min));
}

// enum aboba {
//   alpha = 1,
//   beta = 2,
//   gamma = 3
// }

// aboba.alpha // 1

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

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

wsserver.on('connection', (socket) => {
	socket.on('message', (data) => {
		console.log(`Received data: ${data}`);
	});
});

server.listen('3000', () => {
	console.log('Server is listening at port 3000');
});
