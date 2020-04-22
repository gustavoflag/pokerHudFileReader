const jogadoresService = require('./../services/jogadoresService.js');

exports.listarJogadores = function(req, res) {
  jogadoresService.listarTodosJogadores(response => {
    if (response.err){
      res.render('jogadores', { title: 'TQSOP Stats', jogadores: null, error: response.err });
    } else {
      res.render('jogadores', { title: 'TQSOP Stats', jogadores: response.data });
    }
    
  });
};

exports.filtrar = function(req, res) {
  jogadoresService.filtrar(req.query.idPokerstars, response => {
    if (response.err){
      res.render('jogadores', { title: 'TQSOP Stats', jogadores: null, error: response.err });
    } else {
      res.render('jogadores', { title: 'TQSOP Stats', jogadores: response.data });
    }
  });
};

exports.consultarMao = function(req, res) {
  console.log('mao', req.query);
  jogadoresService.consultarMao(req.query.idMao, response => {
    if (response.err){
      res.render('mao', { title: 'TQSOP Stats', mao: null, error: response.err });
    } else {
      res.render('mao', { title: 'TQSOP Stats', mao: response.data });
    }
  });
};