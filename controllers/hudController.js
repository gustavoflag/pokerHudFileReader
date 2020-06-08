const jogadoresService = require('./../services/jogadoresService.js');

exports.listarJogadores = function(req, res) {

  let order = req.params.order;
  let asc = req.params.asc;

  jogadoresService.listarTodosJogadores(order, asc, response => {
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

exports.popup = function(req, res) {
  var filtro = "";

  if (req.query.idPokerstars){
    filtro = req.query.idPokerstars;
  } else if (req.params.idPokerstars){
    filtro = req.params.idPokerstars;
  }

  jogadoresService.filtrar(filtro, response => {
    if (response.err){
      res.render('jogadorPopup', { layout: 'clean', title: 'TQSOP Stats', jogador: null, error: response.err });
    } else {
      res.render('jogadorPopup', { layout: 'clean', title: 'TQSOP Stats', jogador: response.data });
    }
  });
};

exports.multiPopup = function(req, res){
  res.render('multiPopup', { title: 'TQSOP Stats' });
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

exports.autoComplete = function(req, res) {
  jogadoresService.autoComplete(req.params.term, response => {
    if (response.err){
      res.json([]);
    } else {
      res.json(response.data);
    }
  });
};