import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import * as express from 'express';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({
	server: server,
});

app.use(express.static('public'));

app.get('/', (req: any, res: any) => {
	res.sendFile(__dirname + '/index.html');
});

wss.on('connection', (socket: any) => {
	socket.on('message', (data: any) => {
		console.log(`Received data: ${data}`);
	});
});

server.listen('3000', () => {
	console.log('Server is listening at port 3000');
});
