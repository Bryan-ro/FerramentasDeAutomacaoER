import CryptoJS  from "crypto-js";

const data = "mfduoqryzzydzatg";

// Encrypt
const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), "secret key 123").toString();
console.log(typeof ciphertext);

// Decrypt
const bytes  = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData);
