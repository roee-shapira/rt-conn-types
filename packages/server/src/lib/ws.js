module.exports.configWS = (io) => {
	io.on('connection', (socket) => {
		const companyId = socket.handshake.query['company-id'];
		console.log(`[WS] ${socket.id} from company id ${companyId}.`);

		let counter = 0;
		const timerId = setInterval(() => {
			socket.emit('message', {
				alive: true,
				counter,
			});
			counter++;

			if (counter > 100) {
				clearInterval(timerId);
				return;
			}
		}, 5000);

		socket.on('disconnect', () => {
			console.log(
				`[WS] ${socket.id} from company id ${companyId} - user disconnected.`
			);
		});
	});

	io.use((socket, next) => {
		const companyId = socket.handshake.query['company-id'];

		if (!companyId) return next(Error('No company ID given.'));
		return next();
	});

	return io;
};
