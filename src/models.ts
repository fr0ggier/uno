import { WebSocket } from 'ws';
import { randomNumber } from './utils';

type Color = 'red' | 'yellow' | 'blue' | 'green';

/*
    number - обычная карта со значением от 0 до 9.
    reverse - меняет направление
    skip - следующий игрок пропускает ход
    taketwo - следующий игрок берёт 2 карты
    choice - ты выбираешь цвет
*/
type CardType = 'number' | 'reverse' | 'skip' | 'taketwo' | 'choice';
type CardValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Card {
	color?: Color;
	type: CardType;
	value?: CardValue;
}

interface NumberCard extends Card {
	color: Color;
	type: 'number';
	value: CardValue;
}

export class Player {
	socket: WebSocket;
	cards: Card[];

	constructor(socket: any) {
		this.socket = socket;
		this.cards = [];
	}

	takeCard() {
		// this.cards.push(...)
	}

	getCards() {
		this.socket.send(JSON.stringify(this.cards));
	}
}

export class Game {
	code: string;
	players: Player[];
	host: Player;
	started: boolean;
	deck: Card[];

	constructor(code: string, firstPlayer: Player) {
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
						color: ['red', 'yellow', 'blue', 'green'][j] as Color,
						value: i as CardValue,
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
						color: ['red', 'yellow', 'blue', 'green'][i] as Color,
						type: ['reverse', 'skip', 'taketwo'][j] as CardType,
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

	generateCard(): Card {
		let index = randomNumber(0, this.deck.length - 1);
		let card = this.deck[index];
		delete this.deck[index];
		return card;
	}

	start(): void {
		this.players.forEach((player) => {
			for (let i = 0; i < 9; i++) {
				player.cards.push(this.generateCard());
			}
			player.getCards();
		});
	}
}
