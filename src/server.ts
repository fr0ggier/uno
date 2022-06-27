import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import * as express from 'express';
import { Player, Game } from './models';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({
	server: server,
});

const games: Map<string, Game> = new Map();

app.use(express.static('public'));

app.get('/', (req: any, res: any) => {
	res.sendFile(__dirname + '/index.html');
});

wss.on('connection', (socket: any) => {
	socket.on('message', (data: string) => {
		let message = JSON.parse(data);

		if (message.type == 'createGame') {
			games.set(message.body.code, new Game(message.body.code, new Player(socket, message.body.name)));
		} else if (message.type == 'joinGame') {
			let game = games.get(message.body.code);
			if (!game) {
				// скажать что автор даун
			} else {
				game.addPlayer(socket, message.body.name);
			}
		} else if (message.type == 'startGame') {
			let game = games.get(message.body.code);
			if (!game) {
				// сказать что автор даун
			} else {
				if (game.host.socket == socket) {
					game.start();
				} else {
					// сказать что автор женщина (не имеет прав)
				}
			}
		}
	});
});

server.listen('3000', () => {
	console.log('Server is listening at port 3000');
});
