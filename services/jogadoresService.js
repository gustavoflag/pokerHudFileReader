const axios = require('axios');
const configGeral = require('./../config.js');

var config = {
    headers:{
        'Content-Type': 'application/json'
    }
};
var token;

exports.listarTodosJogadores = function(order, asc, callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;

        let orderQuery = "";
        if (order){
            orderQuery += "/" + order;

            if (asc){
                orderQuery += "/" + asc;
            }
        }

        axios.get(`${configGeral.urlAPI}/todosJogadores${orderQuery}`, config)
            .then((response) => {
                callback({err: null, data: response.data});
            })
            .catch(err => {
                callback({err: err, data: null});
            });
    });
}

exports.filtrar = function(idPokerstars, callback) {
    login((err, data) => {
      config.headers.Authorization = `JWT ${token}`;
  
      axios.get(`${configGeral.urlAPI}/jogador/${idPokerstars}`, config)
        .then((response) => {
            callback({ err: null, data: response.data});
        })
        .catch(err => {
            callback({err: err, data: null});
        });
    });
};

exports.consultarMao = function(idMao, callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;
    
        axios.get(`${configGeral.urlAPI}/mao/${idMao}`, config)
          .then((response) => {
              callback({ err: null, data: response.data});
          })
          .catch(err => {
              callback({err: err, data: null});
          });
    });
};

exports.inserirMao = function(mao, callback){
    login((err, data) => {
        if (err){
            console.log('err', err);
        }
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
};

exports.autoComplete = function (nome, callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;

        axios.get(`${configGeral.urlAPI}/autocomplete/${nome}`, config)
          .then((response) => {
              callback({ err: null, data: response.data});
          })
          .catch(err => {
              callback({err: err, data: null});
          });
    });
};

exports.inserirTorneio = function(torneio, callback) {
    login((err, data) => {
        if (err){
            console.log('err', err);
        }
        config.headers.Authorization = `JWT ${token}`;
        axios.post(`${configGeral.urlAPI}/torneio`, torneio, config)
            .then((response) => {
                callback(null, response.data.message);
            })
            .catch((err) => {
                callback(err.response.data, null);
            });
    });
};

exports.inserirMaoTorneio = function(idTorneio, mao, callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;
        axios.patch(`${configGeral.urlAPI}/torneio/${idTorneio}`, mao, config)
            .then((response) => {
                callback(null, response.data.message);
            })
            .catch((err) => {
                callback(err, null);
            });
    });
};

exports.processarTorneio = function(idTorneio, callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;
        axios.post(`${configGeral.urlAPI}/torneio/processar`, { idTorneio: idTorneio }, config)
            .then((response) => {
                callback(null, response.data.message);
            })
            .catch((err) => {
                callback(err.response.data, null);
            });
        });
};

exports.listarTorneios = function(callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;
        axios.get(`${configGeral.urlAPI}/torneio`, config)
            .then((response) => {
                callback({ err: null, data: response.data });
            })
            .catch((err) => {
                callback(err, null);
            });
    });
};

exports.consultarTorneio = function(idTorneio, callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;
        axios.get(`${configGeral.urlAPI}/torneio/processar/${idTorneio}`, config)
            .then((response) => {
                callback({ err: null, data: response.data });
            })
            .catch((err) => {
                callback(err, null);
            });
    });
};

exports.consultarMaoTorneio = function(idTorneio, idMao, callback) {
    login((err, data) => {
        config.headers.Authorization = `JWT ${token}`;
        axios.get(`${configGeral.urlAPI}/torneio/${idTorneio}/mao/${idMao}`, config)
            .then((response) => {
                callback({ err: null, data: response.data });
            })
            .catch((err) => {
                callback(err, null);
            });
    });
};

function login(callback){
    if (!token){
        var loginData = {
            login: configGeral.userAPI,
            senha: configGeral.passwordAPI
        }

        axios.post(`${configGeral.urlAPI}/auth/login`, loginData, config)
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