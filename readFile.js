var fs = require('fs');
var ft = require('file-tail').startTailing('teste.txt');


/*
var watch = require('node-watch');

watch('teste.txt', { recursive: true }, function(evt, name) {
  //console.log('%s changed.', name);
  console.log(evt);
});
*/
/*
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('teste.txt'),
  crlfDelay: Infinity
});
*/

var leitura = false;
var jogadores = [];
var jaRaise = false;

var i = 0;

ft.on('line', function(line) {
    //console.log(line);
    readLine(line);
    if (line == "PRINT"){
        console.log("ID:", mao.id);
        console.log(mao.preFlop.jogadores);
    }
});

var mao = {
  id: "",
  preFlop: {
    jogadores: [/*{
      nome: "",
      acao: ""
    }*/]
  }
};

function readLine(line){
  if (line.indexOf("Hand #") != -1){
    var pattern = /#\d*:/;
    var res = line.match(pattern);
    if (res){
      mao.id = res[0].replace(":", "");//.split(":")[0];
    }
    //console.log(mao.id);
  } else if (line.indexOf("*** HOLE CARDS ***") != -1){
    leitura = true;
  } else if (line.indexOf("*** FLOP ***") != -1
      || line.indexOf("*** SUMMARY ***") != -1){
    leitura = false;
    jaRaise = false;
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
    if (leitura){
      var sptLine = line.split(':');
      var nome = sptLine[0];
      var acao = "";

      if (sptLine.length > 1){
        acao = sptLine[1].trim();
      }

      if (nome != ""){
        mao.preFlop.jogadores.push({
          nome: nome,
          acao: acao
        });
      }




      /*var jogador = mao.jogadores.preflop.find((jogador) => jogador.nome === nome);

      if (!jogador){
        jogador = {
          nome: nome,
          maos: 0,
          fold: 0,
          call: 0,
          raise: 0,
          reRaise: 0,
          idUltimaMao: ""
        };

        jogadores.push(jogador);
      }
      //console.log(`${jogador.nome} ${acao}`);

      if (idMao != jogador.idUltimaMao){
        if (acao.indexOf("raises") != -1
            || acao.indexOf("bets") != -1){
          if (jaRaise){
            jogador.reRaise++;
          } else {
            jogador.raise++;
          }
          jaRaise = true;
          jogador.maos++;

        } else if (acao.indexOf("folds") != -1){
          jogador.fold++;
          jogador.maos++;
        } else if (acao.indexOf("calls") != -1
                   || acao.indexOf("checks") != -1){
          jogador.call++;
          jogador.maos++;
          //console.log(`${jogador.nome} ${acao}`);
        }
      }*/
    }
  }
}

/*
rl.on('line', (line) => {
  i++;
  if (line.indexOf("PokerStars Hand ") != -1){
    idMao = line.replace("PokerStars Hand ", "").split(":")[0];
  } else if (line.indexOf("*** HOLE CARDS ***") != -1){
    leitura = true;
  } else if (line.indexOf("*** FLOP ***") != -1
      || line.indexOf("*** SUMMARY ***") != -1){
    leitura = false;
    jaRaise = false;
    idMao = "";
  } /*else if (line.indexOf("Dealt to ") != -1){

  } else if (line.indexOf("Uncalled bet ") != -1
      || line.indexOf("collected ") != -1
      || line.indexOf(" is sitting out") != -1
      || line.indexOf(" has timed out") != -1
      || line.indexOf(" has returned") != -1
      || line.indexOf(" is disconnected") != -1
      || line.indexOf(" is connected") != -1
      || line.indexOf(" finished ") != -1
      || line.indexOf(" said") != -1){

  } */

  /*else if (line.indexOf(":") != -1){
    if (leitura){
      var sptLine = line.split(':');
      var nome = sptLine[0];
      var acao = ""

      if (sptLine.length > 1){
        acao = sptLine[1];
      }

      var jogador = jogadores.find((jogador) => jogador.nome === nome);

      if (!jogador){
        jogador = {
          nome: nome,
          maos: 0,
          fold: 0,
          call: 0,
          raise: 0,
          reRaise: 0,
          idUltimaMao: "",
          text: []
        };

        jogadores.push(jogador);
      }

      if (idMao != jogador.idUltimaMao){
        if (acao.indexOf("raises") != -1
            || acao.indexOf("bets") != -1){
          if (jaRaise){
            jogador.reRaise++;
          } else {
            jogador.raise++;
          }
          jaRaise = true;
          jogador.maos++;
        } else if (acao.indexOf("folds") != -1){
          jogador.fold++;
          jogador.maos++;
        } else if (acao.indexOf("calls") != -1){
          jogador.call++;
          jogador.maos++;
        }

        //jogador.text.push(acao);

        jogador.idUltimaMao = idMao;
      }
    }
  }

  if (i === 8839){
    console.log(jogadores);
  }
});*/
