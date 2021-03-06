var fs = require('fs');
//var ft = require('file-tail').startTailing('teste.txt');
const axios = require('axios');
const configGeral = require('./config.js');
const jogadoresService = require('./services/jogadoresService.js')


var leitura = false;

const streets = {
  PRE_FLOP: 0,
  FLOP: 1,
  TURN: 2,
  RIVER: 3
}

var street = 0;

var jogadores = [];
var arquivos = [];

var token;

var i = 0;

/*ft.on('line', function(line) {
  readLine(line);
});*/
var mao = {
  idPokerstars: ""
};

arquivos = fs.readdirSync('./../HudFiles/');
//console.log(arquivos);

torneiosAProcessar = [];

linhasArquivo = [];
maos = []; 

mao = {
  idPokerstars: ""
};

enviarArquivoNovo();

//enviarArquivoRecursivo();

function enviarArquivoRecursivo(){  
  maos = [];
  var file = arquivos[0];
  console.log('***lendo arquivo: ', file);
  var countMaosEnviadas = 0;

  var readEachLineSync = require('read-each-line-sync');

  readEachLineSync('./../HudFiles/' + file, function(line) {
    //console.log(line);
    readPokerLine(line);
  });

  maos.forEach(maoEnvio => {
    jogadoresService.inserirMao(maoEnvio, (err, message) => {
      if (err){
        console.log('----ERRO AO ENVIAR MÃO', maoEnvio.idPokerstars, 'detalhes API:', err, '----');
      } else {
        console.log(`----Mão ${maoEnvio.idPokerstars} Enviada - msg API: ${message}----`);
      }

      countMaosEnviadas++;
      if (maos.length == countMaosEnviadas){
        console.log('***arquivo enviado');
        arquivos.splice(0, 1);
        if (arquivos.length > 0){
          enviarArquivoRecursivo();
        }
      }
    });
  });
}

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
    leitura = true;
    street++;
  } else if (line.indexOf("*** RIVER ***") != -1){
    leitura = true;
    street++;
  } else if (line.indexOf("*** SHOW DOWN ***") != -1){
    leitura = false;
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
      || line.indexOf(" show hand") != -1
      || line.indexOf(" shows ") != -1){

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

function enviarArquivoNovo(){
  maos = [];
  var file = arquivos[0];
  console.log('***lendo arquivo: ', file);
  var countMaosEnviadas = 0;

  var readEachLineSync = require('read-each-line-sync');

  var torneio = {
  };

  torneio.idTorneio = "";
  torneio.maos = [];

  var maoCorrente = {
    idMao: undefined,
    linhas: []
  };

  readEachLineSync('./../HudFiles/' + file, function(line) {
    if (line.indexOf("Hand #") != -1){
      if (torneio.idTorneio == ""){
        var pattern = /Tournament #\d*,/;
        var res = line.match(pattern);
        if (res){
          torneio.idTorneio = res[0].replace("Tournament", "")
            .replace(" ", "")
            .replace("#", "")
            .replace(",", "");
        }
      }

      if (maoCorrente.idMao){
        //console.log('add mão', maoCorrente);
        torneio.maos.push(maoCorrente);
        maoCorrente = {
          idMao: undefined,
          linhas: []
        };
      }
      var pattern = /#\d*:/;
      var res = line.match(pattern);
      if (res){
        maoCorrente.idMao = res[0].replace(":", "").replace("#", "");//.split(":")[0];
      }
    }
    var linhaTrimmed = line.replace("\r", "").replace("\n", "").trim();
  
    if (linhaTrimmed && linhaTrimmed.length > 0){
      maoCorrente.linhas.push(linhaTrimmed);
    }
  });

  torneio.maos.push(maoCorrente);
  maoCorrente = {
    idMao: undefined,
    linhas: []
  };

  jogadoresService.inserirTorneio({ idTorneio: torneio.idTorneio, maos: []}, (err, message) => {
    if (!err){
      torneio.maos.forEach(mao => {
        console.log(`ENVIANDO MÃO ${mao.idMao}`);
        jogadoresService.inserirMaoTorneio(torneio.idTorneio, mao, (err, message) => {
          if(!err){
            console.log(`MÃO ${mao.idMao} ENVIADA:`, message);
          }
          else {
            console.log(`MÃO ${mao.idMao} COM ERRO`, err);
          }
          countMaosEnviadas++;

          if (countMaosEnviadas == torneio.maos.length){
            //torneiosAProcessar.push(torneio.idTorneio);

            // console.log('***arquivo enviado***');
            // arquivos.splice(0, 1);
            // if (arquivos.length > 0){
            //   enviarArquivoNovo();
            // } else {

            // }
            console.log('processando torneio', torneio.idTorneio);
            jogadoresService.processarTorneio(torneio.idTorneio, (err, message) => {
              if (!err){
                console.log(message);
              } else {
                console.log(err);
              }

              console.log('***arquivo enviado***');
              arquivos.splice(0, 1);
              if (arquivos.length > 0){
                enviarArquivoNovo();
              } 
            });
          }
        });
      })
    }
  });
}

function processarTorneiosSync(){

  jogadoresService.processarTorneio(torneiosAProcessar[0].idTorneio, (err, message) => {
    if (!err){
      console.log(message);
    } else {
      console.log(err);
    }
  });
}