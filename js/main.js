import { encryptFileAES, decryptFileAES, caesarCipher, generateHash } from './cryptoService.js';
import { explainConcept } from './geminiService.js';

// State
let activeMode = 'AES';
let logs = [];

// DOM Elements
const logContainer = document.getElementById('log-container');
const aesSection = document.getElementById('aes-section');
const caesarSection = document.getElementById('caesar-section');
const hashSection = document.getElementById('hash-section');
const aboutSection = document.getElementById('about-section');
const geminiContainer = document.getElementById('gemini-container');
const geminiContent = document.getElementById('gemini-content');
const geminiToggle = document.getElementById('gemini-toggle');
const geminiModal = document.getElementById('gemini-modal');
const settingsModal = document.getElementById('settings-modal');

// Logger
const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    logs = [{ timestamp, type, message }, ...logs].slice(0, 50);
    renderLogs();
};

const renderLogs = () => {
    logContainer.innerHTML = '';
    if (logs.length === 0) {
        logContainer.innerHTML = '<span class="text-gray-600 italic">Ready...</span>';
        return;
    }
    logs.forEach(log => {
        const div = document.createElement('div');
        div.className = `flex gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-blue-300'}`;
        div.innerHTML = `<span class="opacity-50">[${log.timestamp}]</span><span>${log.message}</span>`;
        logContainer.appendChild(div);
    });
};

// Navigation
const setActiveMode = (mode) => {
    activeMode = mode;

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-cyber-800', 'text-cyber-accent', 'border', 'border-cyber-700', 'shadow-lg', 'text-purple-400', 'text-yellow-500');
        btn.classList.add('text-gray-400');
        if (btn.dataset.mode === mode) {
             btn.classList.remove('text-gray-400');
             btn.classList.add('bg-cyber-800', 'border', 'border-cyber-700', 'shadow-lg');
             if(mode === 'AES') btn.classList.add('text-cyber-accent');
             if(mode === 'HASH') btn.classList.add('text-purple-400');
             if(mode === 'CAESAR') btn.classList.add('text-yellow-500');
        }
    });
    aesSection.classList.add('hidden');
    caesarSection.classList.add('hidden');
    hashSection.classList.add('hidden');
    aboutSection.classList.add('hidden');

    if (mode === 'AES') aesSection.classList.remove('hidden');
    if (mode === 'CAESAR') caesarSection.classList.remove('hidden');
    if (mode === 'HASH') hashSection.classList.remove('hidden');
    if (mode === 'ABOUT') aboutSection.classList.remove('hidden');

    updateGemini();
};

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveMode(btn.dataset.mode));
});


// AES Tool
const aesFileInput = document.getElementById('aes-file');
const aesFileDisplay = document.getElementById('aes-file-display');
const aesPassword = document.getElementById('aes-password');
const aesEncryptBtn = document.getElementById('aes-encrypt-btn');
const aesDecryptBtn = document.getElementById('aes-decrypt-btn');
let aesFile = null;

document.getElementById('aes-file-drop').addEventListener('click', () => aesFileInput.click());
aesFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        aesFile = e.target.files[0];
        aesFileDisplay.innerHTML = `<div class="text-cyber-accent font-mono break-all">${aesFile.name} (${(aesFile.size / 1024).toFixed(2)} KB)</div>`;
    }
});

const handleAES = async (operation) => {
    if (!aesFile || !aesPassword.value) {
        addLog('error', 'Please select a file and enter a password.');
        return;
    }

    const btn = operation === 'encrypt' ? aesEncryptBtn : aesDecryptBtn;
    const originalText = btn.innerText;
    btn.innerText = 'Processing...';
    btn.disabled = true;

    try {
        if (operation === 'encrypt') {
            const encryptedBlob = await encryptFileAES(aesFile, aesPassword.value);
            const url = URL.createObjectURL(encryptedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${aesFile.name}.enc`;
            a.click();
            URL.revokeObjectURL(url);
            addLog('success', `Encrypted ${aesFile.name} successfully.`);
        } else {
            const decryptedBuffer = await decryptFileAES(aesFile, aesPassword.value);
            const blob = new Blob([decryptedBuffer]);
            const originalName = aesFile.name.endsWith('.enc') ? aesFile.name.slice(0, -4) : `decrypted_${aesFile.name}`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalName;
            a.click();
            URL.revokeObjectURL(url);
            addLog('success', `Decrypted ${originalName} successfully.`);
        }
    } catch (error) {
        addLog('error', operation === 'encrypt' ? `Encryption failed: ${error}` : 'Decryption failed. Check your password.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

aesEncryptBtn.addEventListener('click', () => handleAES('encrypt'));
aesDecryptBtn.addEventListener('click', () => handleAES('decrypt'));


// Caesar Tool 
const caesarInput = document.getElementById('caesar-input');
const caesarOutput = document.getElementById('caesar-output');
const caesarShift = document.getElementById('caesar-shift');
const caesarShiftVal = document.getElementById('caesar-shift-val');

const updateCaesar = () => {
    const text = caesarInput.value;
    const shift = parseInt(caesarShift.value);
    caesarShiftVal.innerText = shift;
    caesarOutput.value = caesarCipher(text, shift);
};

caesarInput.addEventListener('input', updateCaesar);
caesarShift.addEventListener('input', updateCaesar);


// Hash Tool
const hashInputText = document.getElementById('hash-input-text');
const hashInputFile = document.getElementById('hash-input-file');
const hashDisplay = document.getElementById('hash-display');
const hashCompare = document.getElementById('hash-compare');
const hashMatchStatus = document.getElementById('hash-match-status');
let currentAlgorithm = 'SHA-256';
let currentHash = '';

const updateHashDisplay = async () => {
    hashDisplay.innerText = currentHash || "Waiting for input...";
    checkHashMatch();
};

const checkHashMatch = () => {
    const compare = hashCompare.value.trim();
    if (!compare || !currentHash) {
        hashMatchStatus.innerHTML = '';
        hashCompare.className = "w-full mt-1 bg-cyber-900 border border-cyber-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500";
        return;
    }

    const isMatch = currentHash.toLowerCase() === compare.toLowerCase();

    if (isMatch) {
         hashCompare.className = "w-full mt-1 bg-cyber-900 border border-cyber-success rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-success";
         hashMatchStatus.innerHTML = `
           <div class="flex items-center gap-2 text-cyber-success bg-cyber-success/10 p-3 rounded-lg border border-cyber-success/30">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
             <span class="font-bold">Match Verified! File is integral.</span>
           </div>`;
    } else {
         hashCompare.className = "w-full mt-1 bg-cyber-900 border border-cyber-danger rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-danger";
         hashMatchStatus.innerHTML = `
           <div class="flex items-center gap-2 text-cyber-danger bg-cyber-danger/10 p-3 rounded-lg border border-cyber-danger/30">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             <span class="font-bold">Mismatch! File may be corrupted or modified.</span>
           </div>`;
    }
};

hashInputText.addEventListener('input', async (e) => {
    const val = e.target.value;
    if (val) {
        currentHash = await generateHash(val, currentAlgorithm);
    } else {
        currentHash = '';
    }
    updateHashDisplay();
});

hashInputFile.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const buffer = await file.arrayBuffer();
        currentHash = await generateHash(buffer, currentAlgorithm);
        addLog('info', `Generated ${currentAlgorithm} for file: ${file.name}`);
        updateHashDisplay();
    }
});

hashCompare.addEventListener('input', checkHashMatch);

document.querySelectorAll('.hash-algo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentAlgorithm = btn.dataset.algo;
        document.querySelectorAll('.hash-algo-btn').forEach(b => {
             b.classList.remove('bg-purple-600', 'text-white');
             b.classList.add('bg-cyber-900', 'text-gray-400', 'border', 'border-cyber-700');
        });
        btn.classList.remove('bg-cyber-900', 'text-gray-400', 'border', 'border-cyber-700');
        btn.classList.add('bg-purple-600', 'text-white');

        if (hashInputText.value) hashInputText.dispatchEvent(new Event('input'));
        if (!hashInputText.value) {
            currentHash = '';
            updateHashDisplay();
        }
    });
});


// Gemini Tutor
const updateGemini = async () => {
    geminiContent.innerHTML = `
      <div class="flex flex-col items-center justify-center py-8 space-y-3">
         <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
         <p class="text-xs text-blue-400 animate-pulse">Consulting the neural net...</p>
      </div>
    `;

    let topic = '';
    let context = '';

    switch (activeMode) {
      case 'AES':
        topic = 'AES Encryption and PBKDF2';
        context = 'encrypting a file using AES-256-GCM with a password derived via PBKDF2';
        break;
      case 'CAESAR':
        topic = 'Caesar Cipher';
        context = 'shifting letters in a text message';
        break;
      case 'HASH':
        topic = 'Cryptographic Hashing';
        context = 'checking file integrity using SHA-256 checksums';
        break;
      case 'ABOUT':
        geminiContent.innerHTML = `
        <div class="prose prose-invert prose-sm text-gray-300 leading-relaxed">
          <p>This section contains information about the developer, <strong>Janith Deshan</strong>.</p>
          <p>Feel free to reach out via email or social media!</p>
        </div>`;
        return;
    }

    const explanation = await explainConcept(topic, context);
    geminiContent.innerHTML = `<div class="prose prose-invert prose-sm text-gray-300 leading-relaxed">${marked.parse(explanation)}</div>`;
};

geminiToggle.addEventListener('click', () => {
    geminiModal.classList.remove('hidden');
    geminiToggle.classList.add('hidden');
});

document.getElementById('gemini-close').addEventListener('click', () => {
    geminiModal.classList.add('hidden');
    geminiToggle.classList.remove('hidden');
});


// Settings
const settingsBtn = document.getElementById('settings-btn');
const settingsClose = document.getElementById('settings-close');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key');

settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    apiKeyInput.value = localStorage.getItem('GEMINI_API_KEY') || '';
});

settingsClose.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

saveApiKeyBtn.addEventListener('click', () => {
    localStorage.setItem('GEMINI_API_KEY', apiKeyInput.value);
    settingsModal.classList.add('hidden');
    updateGemini();
});

updateCaesar();
updateGemini();
renderLogs();
