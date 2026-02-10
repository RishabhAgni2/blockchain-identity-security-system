const CryptoJS = require("crypto-js");

const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};

module.exports = hashData;
