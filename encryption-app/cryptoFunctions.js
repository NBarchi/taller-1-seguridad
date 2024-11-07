const fs = require('fs');
const crypto = require('crypto');

// Cifrado simétrico (AES)
const encryptAES = (plaintext, key) => {
  // Asegurarse de que la longitud de la clave sea de 32 bytes (256 bits)
  const adjustedKey = Buffer.from(key, 'utf-8');
  if (adjustedKey.length !== 32) {
    throw new Error('Invalid key length. AES-256 requires a 32-byte key.');
  }

  // Generar un IV (vector de inicialización) aleatorio
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', adjustedKey, iv);
  let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  
  // Retornar el IV junto con los datos cifrados (en formato hexadecimal)
  return iv.toString('hex') + encrypted;
};

const decryptAES = (ciphertext, key) => {
  // Asegurarse de que la longitud de la clave sea de 32 bytes (256 bits)
  const adjustedKey = Buffer.from(key, 'utf-8');
  if (adjustedKey.length !== 32) {
    throw new Error('Invalid key length. AES-256 requires a 32-byte key.');
  }

  // Extraer el IV (los primeros 32 caracteres hexadecimales)
  const iv = Buffer.from(ciphertext.slice(0, 32), 'hex');
  const encryptedText = ciphertext.slice(32);

  const decipher = crypto.createDecipheriv('aes-256-cbc', adjustedKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
};

// Cifrado asimétrico (RSA)
const publicKey = fs.readFileSync('public_key.pem', 'utf8');

// Función de cifrado RSA
const encryptRSA = (plaintext, publicKey) => {
  const buffer = Buffer.from(plaintext, 'utf-8');
  try {
    // Cifra con la clave pública
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  } catch (error) {
    console.error("Error en el cifrado RSA:", error);
    throw error; // Lanza el error para ser manejado
  }
};

const decryptRSA = (ciphertext, privateKey) => {
  const buffer = Buffer.from(ciphertext, 'base64');
  try {
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf-8');
  } catch (error) {
    console.error("Error en el descifrado RSA:", error);
    throw error; // Lanza el error para ser manejado
  }
};

// Ejemplo de uso
const plaintext = "Este es un mensaje secreto.";
const encryptedMessage = encryptRSA(plaintext, publicKey);
console.log("Mensaje cifrado con RSA:", encryptedMessage);

module.exports = { encryptAES, decryptAES, encryptRSA, decryptRSA };
