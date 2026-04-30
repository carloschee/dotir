/**
 * Dótir - Lógica Multidispositivo
 */

const vocabulary = [
    { id: 'yo', cat: 'subject', label: 'Yo', img: 'yo.png', voice: 'Yo' },
    { id: 'quiero', cat: 'action', label: 'Quiero', img: 'quiero.png', voice: 'quiero' },
    { id: 'comer', cat: 'action', label: 'Comer', img: 'comer.png', voice: 'comer' },
    { id: 'beber', cat: 'action', label: 'Beber', img: 'beber.png', voice: 'beber' },
    { id: 'agua', cat: 'noun', label: 'Agua', img: 'agua.png', voice: 'agua' },
    { id: 'manzana', cat: 'noun', label: 'Manzana', img: 'manzana.png', voice: 'manzana' },
    { id: 'duele', cat: 'medical', label: 'Duele', img: 'dolor.png', voice: 'me duele' },
    { id: 'cabeza', cat: 'medical', label: 'Cabeza', img: 'cabeza.png', voice: 'la cabeza' },
    { id: 'feliz', cat: 'social', label: 'Feliz', img: 'feliz.png', voice: 'estoy feliz' },
    { id: 'ayuda', cat: 'social', label: 'Ayuda', img: 'ayuda.png', voice: 'necesito ayuda' }
];

let currentPhrase = [];

// Navegación Modular
function navigateTo(view) {
    const menuView = document.getElementById('view-menu');
    const moduleView = document.getElementById('view-module');

    if (view === 'saac') {
        menuView.classList.add('hidden');
        moduleView.classList.remove('hidden');
        renderSAAC();
    } else {
        menuView.classList.remove('hidden');
        moduleView.classList.add('hidden');
        // Limpiamos frase al volver al menú para evitar confusiones cognitivas
        currentPhrase = [];
        updatePhraseDisplay();
    }
}

// Renderizado del Tablero
function renderSAAC() {
    const grid = document.getElementById('pictogram-grid');
    grid.innerHTML = '';

    vocabulary.forEach(item => {
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat}`;
        card.innerHTML = `
            <img src="assets/pics/${item.img}" alt="${item.label}" 
                 onerror="this.src='https://via.placeholder.com/100?text=${item.label}'">
            <span class="picto-label">${item.label}</span>
        `;
        card.onclick = () => addToPhrase(item);
        grid.appendChild(card);
    });
}

function addToPhrase(item) {
    currentPhrase.push(item);
    updatePhraseDisplay();
    speak(item.voice);
}

function updatePhraseDisplay() {
    const display = document.getElementById('current-phrase');
    display.innerHTML = '';
    currentPhrase.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = `assets/pics/${item.img}`;
        img.onerror = (e) => e.target.src = `https://via.placeholder.com/60?text=${item.label}`;
        img.onclick = (e) => {
            e.stopPropagation();
            currentPhrase.splice(index, 1);
            updatePhraseDisplay();
        };
        display.appendChild(img);
    });
}

// Síntesis de Voz
function speak(text) {
    if (!text) return;
    window.speechSynthesis.cancel(); // Detiene voces previas
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'es-ES';
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
}

function speakPhrase() {
    if (currentPhrase.length === 0) return;
    const fullText = currentPhrase.map(i => i.voice).join(' ');
    speak(fullText);
}

// Eventos Globales
document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            currentPhrase = [];
            updatePhraseDisplay();
        };
    }
});

// Service Worker (Modo Avión)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}