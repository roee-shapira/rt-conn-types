module.exports.configWS = (io) => {
	io.on('connection', (socket) => {
		console.log('A user connected');

		socket.on('disconnect', () => {
			console.log('User disconnected');
		});
	});

	io.use((socket, next) => {
		const companyId = socket.handshake.query['company-id'];

		if (!companyId) return next(Error('No company ID given.'));
		return next();
	});

	return io;
};
