import { WebSocket } from 'ws';
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
	console.log('Соединение с сервером установлено');
};

ws.onclose = (event) => {
	console.log(`Код: ${event.code}\nПричина: ${event.reason}`);
};

ws.onerror = (err) => {
	console.log(`Ошибка ${err.message}`);
};
