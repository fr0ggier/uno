import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import * as express from 'express';
import { Player, Game } from './models';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({
	server: server,
});

const games: Game[] = [];

app.use(express.static('public'));

app.get('/', (req: any, res: any) => {
	res.sendFile(__dirname + '/index.html');
});

wss.on('connection', (socket: any) => {
	socket.on('message', (data: string) => {
		let message = JSON.parse(data);

		if (message.type == 'createGame') {
			games.push(new Game(message.body, new Player(socket)));
		} else if (message.type == 'joinGame') {

		} else if(message.type == 'startGame') {

		}
	});

	games.push(new Game('aboba', new Player(socket)));
	games[0].start();
});

server.listen('3000', () => {
	console.log('Server is listening at port 3000');
});
