'use strict';
module.exports = function(app) {
  var hudController = require('../controllers/hudController.js');

  app.route('/')
    .get(hudController.listarJogadores);

  app.route('/filtrar')
    .get(hudController.filtrar);

  app.route('/jogador/:idPokerstars')
    .get(hudController.filtrar);

  app.route('/autocomplete/:term')
    .get(hudController.autoComplete);

  app.route('/popup/:idPokerstars')
    .get(hudController.popup);    

  app.route('/mao/:idMao')
    .get(hudController.consultarMao);
};
