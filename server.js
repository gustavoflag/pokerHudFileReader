const exphbs = require('express-handlebars');
const path = require('path');
const config = require('./config.js')
var express = require('express'),
  app = express(),
  port = process.env.PORT || 5600;

var handlebarsHelpers = require('handlebars-helpers')();

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/favicon.ico', express.static('favicon.ico'));

app.engine('.hbs', exphbs({
  defaultLayout: 'main'
  , extname: '.hbs'
  , helpers: { 
    handlebarsHelpers, 
    theme: function(){ 
      return config.theme; 
    },
    moreThen: function(v1, v2){
      return v1 > v2;
    },
    moreThenEq: function(v1, v2){
      return v1 >= v2;
    },
    lessThen: function(v1, v2){
      return v1 < v2;
    },
    lessThenEq: function(v1, v2){
      return v1 <= v2;
    }
  }
}));


app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "views"));



var routes = require('./routes/pokerHudRoutes');

routes(app);

app.listen(port);

//console.log(`Servidor iniciado, acesse o hud em http://localhost:${port}`);