'use strict';
module.exports = function(app) {
  var hudController = require('../controllers/hudController.js');

  app.route('/')
    .get(hudController.listarJogadores);

  app.route('/filtrar')
    .get(hudController.filtrar);
};
