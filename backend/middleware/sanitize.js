var express = require('express');
var app = express();
app.use(require('sanitize').middleware);
app.get('/ping', function(req, res) {
	var param = req.queryInt('param');
	res.send('pong ' + (typeof param) + ' ' + param);
});
app.listen(3000);