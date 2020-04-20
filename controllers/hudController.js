const axios = require('axios');
const configGeral = require('./../config.js');
var token;

exports.listarJogadores = function(req, res) {
  var config = {
    headers:{
      'Content-Type': 'application/json'
    }
  };

  login(config, (err, data) => {
    config.headers.Authorization = `JWT ${token}`;

    axios.get(`${configGeral.urlAPI}/todosJogadores`, config)
      .then((response) => {
        //console.log("response get", response.data);
        res.render('jogadores', { title: 'TQSOP Stats', jogadores: response.data });
      })
      .catch(err => {
        console.log('err', err);
      });
    });
};

exports.filtrar = function(req, res) {
  var config = {
    headers:{
      'Content-Type': 'application/json'
    }
  };

  login(config, (err, data) => {
    config.headers.Authorization = `JWT ${token}`;

    axios.get(`${configGeral.urlAPI}/jogador/${req.query.idPokerstars}`, config)
      .then((response) => {
        res.render('jogadores', { title: 'TQSOP Stats', jogadores: response.data });
      })
      .catch(err => {
        res.render('jogadores', { title: 'TQSOP Stats', jogadores: null, error: err.response.data.error.message });
      });
    });
};

function login(configPost, callback){
  if (!token){
    var loginData = {
      login: configGeral.userAPI,
      senha: configGeral.passwordAPI
    }

    axios.post(`${configGeral.urlAPI}/auth/login`, loginData, configPost)
      .then((response) => {
        token = response.data.token;
        callback(null, null);
      })
      .catch((err) => {
        if (err.response){
          callback(err.response.data, null);
        } else {
          callback(err, null);
        }
        
      });

  } else {
    callback(null, null);
  }
}

