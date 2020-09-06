const app = require('express')();
const morgan = require('morgan');
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	transports: ['websocket'],
});

const { configSSE } = require('./lib/sse');
const { configWS } = require('./lib/ws');

app.use(morgan('common'));
app.use(cors());
app.route('/health-check').get((_, res) =>
	res.status(200).send({ alive: true })
);

configSSE(app);
configWS(io);

app.use((_, res) => res.status(404).send({ error: 'Page not found.' }));

const port = 5000;
server.listen(port, () => {
	console.debug(`listening on http://localhost:${port}`);
});
