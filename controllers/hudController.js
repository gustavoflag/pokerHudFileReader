exports.listarJogadores = function(req, res) {
  res.render('jogadores', { title: 'teste', jogadores: global.jogadoresMao });
};
