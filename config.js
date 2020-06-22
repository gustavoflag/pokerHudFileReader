let ambiente = "PRD";

switch(ambiente){
    case "DEV":
        exports.urlAPI = 'http://localhost:5500';
        exports.userAPI = 'tqsop';
        exports.passwordAPI = 'Tqsop2020';
    break;
    case "STG":
        exports.urlAPI = 'https://stg-poker-hud-api.herokuapp.com';
        exports.userAPI = 'tqsop';
        exports.passwordAPI = 'Tqsop2020';
    break;
    case "PRD":
        exports.urlAPI = 'https://poker-hud-api.herokuapp.com';
        exports.userAPI = 'tqsop';
        exports.passwordAPI = 'Tqsop2020!';
    break;
}

exports.theme = 'dark';