var fs = require('fs');
//var ft = require('file-tail').startTailing('teste.txt');
const axios = require('axios');
const configGeral = require('./config.js')

var leitura = false;

const streets = {
  PRE_FLOP: 0,
  FLOP: 1,
  TURN: 2,
  RIVER: 3
}

var street = 0;

var jogadores = [];
var token;

var i = 0;

/*ft.on('line', function(line) {
  readLine(line);
});*/

linhasArquivo = [];
maos = [];

var mao = {
  idPokerstars: ""
};

var readEachLineSync = require('read-each-line-sync');
 
readEachLineSync('teste.txt', function(line) {
  console.log(line);
  readPokerLine(line);
});

maos.forEach(maoEnvio => {
  postMao(maoEnvio, (err, message) => {
    if (err){
      console.log('----ERRO AO ENVIAR MÃO', maoEnvio.idPokerstars, 'detalhes API:', err, '----');
    } else {
      console.log(`----Mão ${maoEnvio.idPokerstars} Enviada - msg API: ${message}----`);
    }
  });
});
  
function readPokerLine(line){

  if (line.indexOf("Hand #") != -1){
    var pattern = /#\d*:/;
    var res = line.match(pattern);
    if (res){
      mao.idPokerstars = res[0].replace(":", "");//.split(":")[0];
    }
    mao.preFlop = [];
    mao.flop = [];
    mao.turn = [];
    mao.river = [];
    street = streets.PRE_FLOP;
  } else if (line.indexOf("*** HOLE CARDS ***") != -1){
    leitura = true;
  } else if (line.indexOf("*** FLOP ***") != -1){
    leitura = true;
    street++;
  } else if (line.indexOf("*** TURN ***") != -1) {
    leitura = false;
    street++;
  } else if (line.indexOf("*** RIVER ***") != -1){
    leitura = false;
    street++;
  } else if (line.indexOf("*** SUMMARY ***") != -1){
    leitura = false;
    maos.push(mao);
    mao = {
      idPokerstars: ""
    };
  } else if (line.indexOf("Dealt to ") != -1){

  } else if (line.indexOf("Uncalled bet ") != -1
      || line.indexOf("collected ") != -1
      || line.indexOf(" is sitting out") != -1
      || line.indexOf(" has timed out") != -1
      || line.indexOf(" has returned") != -1
      || line.indexOf(" is disconnected") != -1
      || line.indexOf(" is connected") != -1
      || line.indexOf(" finished ") != -1
      || line.indexOf(" said") != -1
      || line.indexOf(" show hand") != -1){

  } else if (line.indexOf(":") != -1){
    if (leitura == true){
      var sptLine = line.split(':');
      var nome = sptLine[0];
      var acao = "";

      if (sptLine.length > 1){
        acao = sptLine[1].trim();
      }

      if (nome != ""){
        switch(street){
          case streets.PRE_FLOP:
            mao.preFlop.push({
              nomeJogador: nome,
              acao: acao
            });
            break;
          case streets.FLOP: 
            mao.flop.push({
              nomeJogador: nome,
              acao: acao
            });
            break;
          case streets.TURN: 
            mao.turn.push({
              nomeJogador: nome,
              acao: acao
            });
            break;
          case streets.RIVER: 
            mao.river.push({
              nomeJogador: nome,
              acao: acao
            });
            break;
        }
      }
    }
  }
}

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

function postMao(mao, callback){
  var config = {
    headers:{
      'Content-Type': 'application/json'
    }
  };

  login(config, (err, data) => {
    config.headers.Authorization = `JWT ${token}`;

    axios.post(`${configGeral.urlAPI}/mao`, mao, config)
      .then((response) => {
        callback(null, response.data.message);
      })
      .catch((err) => {
        if (err && err.response && err.response.status == 401){ //Token não autorizado
          console.log('----TOKEN EXPIRADO, Tentando novamente----');
          token = null;
          login(config, (err, data) => {
            config.headers.Authorization = `JWT ${token}`;

            axios.post(`${configGeral.urlAPI}/mao`, mao, config)
              .then((response) => {
                callback(null, response.data.message);
              })
              .catch((err) => {
                callback(err.response.data, null);
              });
          });
        } else {
          if (err.response){
            callback(err.response.data, null);
          } else {
            callback(err, null);
          }
        }
      });
  });
}

/*postMaoRecursivo();

function postMaoRecursivo(){
  var maoEnvio = maos[0];
  postMao(maoEnvio, (err, message) => {
    if (err){
      console.log('----ERRO AO ENVIAR MÃO', maoEnvio.idPokerstars, 'detalhes API:', err, '----');
    } else {
      console.log(`----Mão ${maoEnvio.idPokerstars} Enviada - msg API: ${message}----`);
    }
    maos.splice(0, 1);
    if (maos.length > 0){
      postMaoRecursivo();
    }
  });
}*/
