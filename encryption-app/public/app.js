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

// Cifrado RSA
document.getElementById('rsaForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const message = document.getElementById('message').value;

  try {
    const response = await fetch('/encrypt-rsa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // Mostrar las claves y mensaje cifrado en el frontend
    document.getElementById('publicKey').innerText = data.publicKey;
    document.getElementById('privateKey').innerText = data.privateKey;
    document.getElementById('encryptedMessage').innerText = data.encryptedMessage;

  } catch (error) {
    console.error('Error al cifrar:', error);
  }
});
