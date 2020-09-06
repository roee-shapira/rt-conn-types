module.exports.configSSE = (app) => {
	app.route('/sse').get((req, res, next) => {
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.flushHeaders();

		const companyId = req.query['company-id'];

		let counter = 0;
		const timerId = setInterval(() => {
			counter++;
			res.write(
				JSON.stringify({
					data: { connType: 'server-side-event', counter, companyId },
				})
			);

			if (counter > 100) {
				clearInterval(timerId);
				res.end();
				return next();
			}
		}, 1000);

		res.on('close', () => {
			console.debug('The client closed the connection.');
			clearInterval(timerId);
			res.end();
			return next();
		});
	});

	return app;
};
