const backendUrl = 'http://localhost:3000';

async function encryptFileAES() {
  const key = document.getElementById('aes-key').value;
  const fileInput = document.getElementById('aes-file');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', key);

  const response = await fetch(`${backendUrl}/encrypt-file/aes`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  document.getElementById('aes-file-encrypted').textContent = `Encrypted file path: ${data.filePath}`;
}

async function decryptFileAES() {
  const key = document.getElementById('aes-key').value;
  const fileInput = document.getElementById('aes-file');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', key);

  const response = await fetch(`${backendUrl}/decrypt-file/aes`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  document.getElementById('aes-file-decrypted').textContent = `Decrypted file path: ${data.filePath}`;
}

async function encryptFileRSA() {
  const publicKey = document.getElementById('rsa-public-key').value;
  const fileInput = document.getElementById('rsa-file');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('publicKey', publicKey);

  const response = await fetch(`${backendUrl}/encrypt-file/rsa`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  document.getElementById('rsa-file-encrypted').textContent = `Encrypted file path: ${data.filePath}`;
}

async function decryptFileRSA() {
  const privateKey = document.getElementById('rsa-private-key').value;
  const fileInput = document.getElementById('rsa-file');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('privateKey', privateKey);

  const response = await fetch(`${backendUrl}/decrypt-file/rsa`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  document.getElementById('rsa-file-decrypted').textContent = `Decrypted file path: ${data.filePath}`;
}
