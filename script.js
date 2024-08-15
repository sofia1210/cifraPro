document.getElementById("cipherOption").addEventListener("click", function () {
  document.getElementById("info").style.display = "none";
});

document
  .getElementById("decipherOption")
  .addEventListener("click", function () {
    document.getElementById("info").style.display = "none";
  });
document.getElementById("acerca").addEventListener("click", function () {
  document.getElementById("info").style.display = "block";
  cipherApp.style.display = "none";
  decipherApp.style.display = "none";
});

const cipherOption = document.getElementById("cipherOption");
const decipherOption = document.getElementById("decipherOption");
const cipherApp = document.getElementById("cipherApp");
const decipherApp = document.getElementById("decipherApp");
const themeSelect = document.getElementById("themeSelect");

const fileInput = document.getElementById("fileInput");
const editor = document.getElementById("editor");
const cipherSelect = document.getElementById("cipherSelect");
const encryptButton = document.getElementById("encryptButton");
const saveButton = document.getElementById("saveButton");
const resultText = document.getElementById("resultText");
const asciiTable = document
  .getElementById("asciiTable")
  .getElementsByTagName("tbody")[0];

const cipheredFileInput = document.getElementById("cipheredFileInput");
const asciiFileInput = document.getElementById("asciiFileInput");
const decryptButton = document.getElementById("decryptButton");
const decryptedText = document.getElementById("decryptedText");

let originalText = "";
let cipheredText = "";
let asciiEquivalence = "";
let cipherMap = new Map();

function setTheme(theme) {
  const root = document.documentElement;
  switch (theme) {
    case "light":
      root.style.setProperty("--bg-color", "#f3f4f6");
      root.style.setProperty("--container-bg", "white");
      root.style.setProperty("--text-color", "#333");
      root.style.setProperty("--primary-color", "#3b82f6");
      root.style.setProperty("--secondary-color", "#2563eb");
      root.style.setProperty("--border-color", "#d1d5db");
      root.style.setProperty("--title-color", "#3b82f6");
      root.style.setProperty("--description-bg", "#e2e8f0");
      root.style.setProperty("--description-text", "#333");
      break;
    case "dark":
      root.style.setProperty("--bg-color", "#1f2937");
      root.style.setProperty("--container-bg", "#374151");
      root.style.setProperty("--text-color", "#e5e7eb");
      root.style.setProperty("--primary-color", "#60a5fa");
      root.style.setProperty("--secondary-color", "#3b82f6");
      root.style.setProperty("--border-color", "#4b5563");
      root.style.setProperty("--title-color", "#60a5fa");
      root.style.setProperty("--description-bg", "#4b5563");
      root.style.setProperty("--description-text", "#e5e7eb");
      break;
    case "vibrant":
      root.style.setProperty("--bg-color", "#ff6b6b");
      root.style.setProperty("--container-bg", "#4ecdc4");
      root.style.setProperty("--text-color", "#ffffff");
      root.style.setProperty("--primary-color", "#45b7d1");
      root.style.setProperty("--secondary-color", "#f7fff7");
      root.style.setProperty("--border-color", "#ff8484");
      root.style.setProperty("--title-color", "#ffffff");
      root.style.setProperty("--description-bg", "#f7fff7");
      root.style.setProperty("--description-text", "#000000");
      break;
    case "professional":
      root.style.setProperty("--bg-color", "#f0f4f8");
      root.style.setProperty("--container-bg", "#ffffff");
      root.style.setProperty("--text-color", "#2d3748");
      root.style.setProperty("--primary-color", "#4a5568");
      root.style.setProperty("--secondary-color", "#718096");
      root.style.setProperty("--border-color", "#e2e8f0");
      root.style.setProperty("--title-color", "#2d3748");
      root.style.setProperty("--description-bg", "#edf2f7");
      root.style.setProperty("--description-text", "#2d3748");
      break;
    case "casual":
      root.style.setProperty("--bg-color", "#faf5ff");
      root.style.setProperty("--container-bg", "#ffffff");
      root.style.setProperty("--text-color", "#4a5568");
      root.style.setProperty("--primary-color", "#9f7aea");
      root.style.setProperty("--secondary-color", "#b794f4");
      root.style.setProperty("--border-color", "#e9d8fd");
      root.style.setProperty("--title-color", "#6b46c1");
      root.style.setProperty("--description-bg", "#f3ebff");
      root.style.setProperty("--description-text", "#4a5568");
      break;
  }
}

themeSelect.addEventListener("change", (e) => {
  setTheme(e.target.value);
});

cipherOption.addEventListener("click", () => {
  cipherApp.style.display = "block";
  decipherApp.style.display = "none";
});

decipherOption.addEventListener("click", () => {
  cipherApp.style.display = "none";
  decipherApp.style.display = "block";
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editor.value = e.target.result;
    };
    reader.readAsText(file);
  }
});

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function updateAsciiTable(originalText, cipheredText) {
  asciiTable.innerHTML = "";
  asciiEquivalence = "";
  const cipherLength = parseInt(cipherSelect.value);
  for (let i = 0; i < originalText.length; i++) {
    const row = asciiTable.insertRow();
    const originalCell = row.insertCell(0);
    const cipheredCell = row.insertCell(1);

    const originalChar = originalText[i];
    const cipheredChunk = cipheredText.substr(i * cipherLength, cipherLength);

    originalCell.textContent = originalChar;
    cipheredCell.textContent = cipheredChunk;

    asciiEquivalence += `${originalChar} -> ${cipheredChunk}\n`;
  }
}

function cipher(text, cipherLength) {
  cipherMap.clear();
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!cipherMap.has(char)) {
      cipherMap.set(char, generateRandomString(cipherLength));
    }
    result += cipherMap.get(char);
  }
  return result;
}

function decipher(text, decipherMap) {
  let result = "";
  const cipherLength = parseInt(
    cipheredFileInput.files[0].name.match(/\d+/)[0]
  );
  for (let i = 0; i < text.length; i += cipherLength) {
    const chunk = text.substr(i, cipherLength);
    result += decipherMap.get(chunk) || chunk;
  }
  return result;
}

encryptButton.addEventListener("click", () => {
  const cipherLength = parseInt(cipherSelect.value);
  originalText = editor.value;
  cipheredText = cipher(originalText, cipherLength);
  resultText.value = cipheredText;
  updateAsciiTable(originalText, cipheredText);
});

saveButton.addEventListener("click", () => {
  const cipherLength = cipherSelect.value;

  // Guardar archivo cifrado
  const cipheredBlob = new Blob([cipheredText], { type: "text/plain" });
  const cipheredUrl = URL.createObjectURL(cipheredBlob);
  const cipheredLink = document.createElement("a");
  cipheredLink.href = cipheredUrl;
  cipheredLink.download = `svcr${cipherLength}bytes.txt`;
  cipheredLink.click();
  URL.revokeObjectURL(cipheredUrl);

  // Guardar archivo de equivalencias ASCII
  const asciiBlob = new Blob([asciiEquivalence], { type: "text/plain" });
  const asciiUrl = URL.createObjectURL(asciiBlob);
  const asciiLink = document.createElement("a");
  asciiLink.href = asciiUrl;
  asciiLink.download = `svcr${cipherLength}bytesASCII.txt`;
  asciiLink.click();
  URL.revokeObjectURL(asciiUrl);
});

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

decryptButton.addEventListener("click", async () => {
  if (!cipheredFileInput.files[0] || !asciiFileInput.files[0]) {
    alert("Por favor, seleccione ambos archivos: el cifrado y la clave ASCII.");
    return;
  }

  try {
    const cipheredContent = await readFile(cipheredFileInput.files[0]);
    const asciiContent = await readFile(asciiFileInput.files[0]);

    // Crear un mapa de descifrado basado en el contenido ASCII
    const decipherMap = new Map();
    asciiContent.split("\n").forEach((line) => {
      const [original, ciphered] = line.split(" -> ");
      if (original && ciphered) {
        decipherMap.set(ciphered, original);
      }
    });

    // Descifrar el contenido
    const decipheredContent = decipher(cipheredContent, decipherMap);

    decryptedText.value = decipheredContent;
    alert("¡Archivo descifrado exitosamente!");
  } catch (error) {
    console.error("Error al descifrar:", error);
    alert(
      "Ocurrió un error al descifrar el archivo. Por favor, verifique que los archivos sean correctos."
    );
  }
});

// Inicializar la tabla ASCII vacía
updateAsciiTable("", "");

// Establecer el tema predeterminado
setTheme("light");
