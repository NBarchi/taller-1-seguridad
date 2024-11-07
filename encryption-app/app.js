const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { encryptAES, decryptAES, encryptRSA, decryptRSA } = require('./cryptoFunctions');

const app = express();
const port = 3000;


// Servir archivos estáticos (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());

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

// Ruta para cifrado asimétrico de archivos (RSA)
app.post('/encrypt-file/rsa', upload.single('file'), (req, res) => {
  const { publicKey } = req.body;
  const filePath = req.file.path;
  const outputPath = `uploads/encrypted-${req.file.filename}`;

  const fileBuffer = fs.readFileSync(filePath);
  const encryptedData = encryptRSA(fileBuffer.toString('utf-8'), publicKey);
  fs.writeFileSync(outputPath, encryptedData, 'utf-8');

  fs.unlinkSync(filePath); // Borrar el archivo original

  res.json({ message: 'File encrypted', filePath: outputPath });
});

// Ruta para descifrado asimétrico de archivos (RSA)
app.post('/decrypt-file/rsa', upload.single('file'), (req, res) => {
  const { privateKey } = req.body;
  const filePath = req.file.path;
  const outputPath = `uploads/decrypted-${req.file.filename}`;

  const fileBuffer = fs.readFileSync(filePath);
  const decryptedData = decryptRSA(fileBuffer.toString('utf-8'), privateKey);
  fs.writeFileSync(outputPath, decryptedData, 'utf-8');

  fs.unlinkSync(filePath); // Borrar el archivo cifrado

  res.json({ message: 'File decrypted', filePath: outputPath });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
