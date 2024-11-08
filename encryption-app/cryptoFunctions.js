const crypto = require('crypto');
const fs = require('fs');

// Cifrado simétrico (AES)
const encryptAES = (plaintext, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), iv);
  let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted; // Incluimos el IV en el resultado cifrado
};

const decryptAES = (ciphertext, key) => {
  const iv = Buffer.from(ciphertext.slice(0, 32), 'hex'); // Extraemos el IV
  const encryptedText = ciphertext.slice(32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

// Cifrado Asimétrico (RSA)
// Función para generar pares de claves RSA
const generateRSAKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  });
  return { publicKey, privateKey };
};

// Función para cifrar con RSA
const encryptRSA = (plaintext, publicKey) => {
  const buffer = Buffer.from(plaintext, 'utf-8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

module.exports = { encryptAES, decryptAES, generateRSAKeyPair, encryptRSA };
