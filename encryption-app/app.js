const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { encryptAES, decryptAES, generateRSAKeyPair, encryptRSA} = require('./cryptoFunctions');

const app = express();
const port = 3000;

// Configuración de multer para subir archivos
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static('public'));

// Ruta para cifrado simétrico de archivos (AES)
app.post('/encrypt-file/aes', upload.single('file'), (req, res) => {
  const { key } = req.body;
  const filePath = req.file.path;
  const outputPath = `uploads/encrypted-${req.file.filename}`;

  const fileBuffer = fs.readFileSync(filePath);
  const encryptedData = encryptAES(fileBuffer.toString('utf-8'), key);
  fs.writeFileSync(outputPath, encryptedData, 'utf-8');

  fs.unlinkSync(filePath); // Borrar el archivo original

  res.json({ message: 'File encrypted', filePath: outputPath });
});

// Ruta para descifrado simétrico de archivos (AES)
app.post('/decrypt-file/aes', upload.single('file'), (req, res) => {
  const { key } = req.body;
  const filePath = req.file.path;
  const outputPath = `uploads/decrypted-${req.file.filename}`;

  const fileBuffer = fs.readFileSync(filePath);
  const decryptedData = decryptAES(fileBuffer.toString('utf-8'), key);
  fs.writeFileSync(outputPath, decryptedData, 'utf-8');

  fs.unlinkSync(filePath); // Borrar el archivo cifrado

  res.json({ message: 'File decrypted', filePath: outputPath });
});

// Ruta para generar claves y cifrar un mensaje con RSA
app.post('/encrypt-rsa', (req, res) => {
  const { message } = req.body;
  
  // Genera par de claves
  const { publicKey, privateKey } = generateRSAKeyPair();

  // Cifra el mensaje con la clave pública
  const encryptedMessage = encryptRSA(message, publicKey);

  res.json({ publicKey, privateKey, encryptedMessage });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
