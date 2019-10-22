var cryptoHelper = {};

var crypto = require('crypto');

cryptoHelper.md5 =function(data)  {
    return crypto.createHash('md5').update(data).digest("hex");
}

cryptoHelper.generarCodigo = function(){
    return crypto.randomBytes(16).toString("hex");

}

module.exports = cryptoHelper;