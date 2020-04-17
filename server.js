const exphbs = require('express-handlebars');
const path = require('path');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 5600;

var handlebarsHelpers = require('handlebars-helpers')();

app.use('/assets', express.static(__dirname + '/assets'));

console.log(__dirname + '/assets');

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "views"));



var routes = require('./routes/pokerHudRoutes');

routes(app);

app.listen(port);

//console.log(`Servidor iniciado, acesse o hud em http://localhost:${port}`);