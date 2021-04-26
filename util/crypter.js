const Crypto = require('crypto-js');

module.exports = {
    //암호화
    encrypt: (data) => {
        return Crypto.AES.encrypt(data, process.env.CRYPTO_KEY).toString();
    },
    //복호화
    decrypt: (data) => {
        return Crypto.AES.decrypt(data, process.env.CRYPTO_KEY).toString(Crypto.enc.Utf8);
    }
};
