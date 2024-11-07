const crypto = require('crypto');
const fs = require('fs');

// Generación de claves RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // Longitud de la clave (2048 bits es bastante segura)
  publicKeyEncoding: {
    type: 'spki', // Tipo de clave pública
    format: 'pem', // Formato PEM
  },
  privateKeyEncoding: {
    type: 'pkcs8', // Tipo de clave privada
    format: 'pem', // Formato PEM
    cipher: 'aes-256-cbc', // Cifra la clave privada (opcional)
    passphrase: 'tu-contraseña', // Cambia por una contraseña segura
  },
});

// Guardar las claves en archivos
fs.writeFileSync('public_key.pem', publicKey);
fs.writeFileSync('private_key.pem', privateKey);

console.log('Claves generadas y guardadas como public_key.pem y private_key.pem');
