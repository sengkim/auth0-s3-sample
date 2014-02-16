var express   = require('express');
var app       = express();

app.use(express.logger());

app.use('/', express.static(__dirname + '/'));

var port = process.env.PORT || 1338;
app.listen(port);
console.log('listening on port http://localhost:' + 1338);