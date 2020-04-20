const axios = require('axios');
const configGeral = require('./../config.js');
var token;

exports.listarTodosJogadores = function(callback) {
    var config = {
        headers:{
        'Content-Type': 'application/json'
        }
    };

    login(config, (err, data) => {
        config.headers.Authorization = `JWT ${token}`;

        axios.get(`${configGeral.urlAPI}/todosJogadores`, config)
            .then((response) => {
                callback({err: null, data: response.data});
            })
            .catch(err => {
                callback({err: err, data: null});
            });
    });
}

exports.filtrar = function(idPokerstars, callback) {
    var config = {
      headers:{
        'Content-Type': 'application/json'
      }
    };
  
    login(config, (err, data) => {
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