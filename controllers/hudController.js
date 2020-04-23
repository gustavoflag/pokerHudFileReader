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
  var filtro = "";

  if (req.query.idPokerstars){
    filtro = req.query.idPokerstars;
  } else if (req.params.idPokerstars){
    filtro = req.params.idPokerstars;
  }

  jogadoresService.filtrar(filtro, response => {
    if (response.err){
      res.render('jogador', { title: 'TQSOP Stats', jogador: null, error: response.err });
    } else {
      res.render('jogador', { title: 'TQSOP Stats', jogador: response.data });
    }
  });
};

exports.consultarMao = function(req, res) {
  jogadoresService.consultarMao(req.params.idMao, response => {
    if (response.err){
      res.render('mao', { title: 'TQSOP Stats', mao: null, error: response.err });
    } else {
      res.render('mao', { title: 'TQSOP Stats', mao: response.data });
    }
  });
};