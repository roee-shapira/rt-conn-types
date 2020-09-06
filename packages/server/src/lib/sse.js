module.exports.configSSE = (app) => {
	app.route('/sse').get((req, res, next) => {
		res.writeHead(200, {
			'Content-Type': 'text/event-stream; charset=utf-8',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		});
		res.flushHeaders();

		const companyId = req.query['company-id'];

		let counter = 0;
		const timerId = setInterval(() => {
			counter++;
			const msg = `id: ${Date.now()}\nevnet: message\ndata: ${JSON.stringify(
				{ counter, companyId }
			)}\n\n`;
			res.write(msg);

			if (counter > 100) {
				clearInterval(timerId);
				res.end();
				return next();
			}
		}, 5000);

		res.on('close', () => {
			console.debug('The client closed the connection.');
			clearInterval(timerId);
			res.end();
			return next();
		});
	});

	return app;
};
