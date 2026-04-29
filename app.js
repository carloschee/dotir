/**
 * Dótir SAAC - Módulo de Comunicación v1.0
 * Optimizado para iPad Air 4 (iPadOS)
 */

// 1. Datos iniciales (Inspirado en tus PDFs: salud, social, conceptos)
const initialVocabulary = [
    { id: 'yo', cat: 'subject', label: 'Yo', img: 'yo.png', voice: 'Yo' },
    { id: 'quiero', cat: 'action', label: 'Quiero', img: 'quiero.png', voice: 'quiero' },
    { id: 'ir', cat: 'action', label: 'Ir', img: 'ir.png', voice: 'ir' },
    { id: 'agua', cat: 'noun', label: 'Agua', img: 'agua.png', voice: 'agua' },
    { id: 'banio', cat: 'noun', label: 'Baño', img: 'banio.png', voice: 'el baño' },
    { id: 'duele', cat: 'medical', label: 'Me duele', img: 'dolor.png', voice: 'Me duele' },
    { id: 'cabeza', cat: 'medical', label: 'Cabeza', img: 'cabeza.png', voice: 'la cabeza' },
    { id: 'mucho', cat: 'descriptor', label: 'Mucho', img: 'mucho.png', voice: 'mucho' },
    { id: 'poco', cat: 'descriptor', label: 'Poco', img: 'poco.png', voice: 'poco' },
    { id: 'suave', cat: 'social', label: 'Suave', img: 'suave.png', voice: 'suave' }
];

// 2. Estado Global de la App
const state = {
    currentPhrase: [],
    language: 'es',
    voices: []
};

// 3. Inicialización de Síntesis de Voz (TTS)
// La preparamos para que sea el siguiente hito, pero dejamos la estructura lista.
const synth = window.speechSynthesis;
function getVoices() {
    state.voices = synth.getVoices();
}
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = getVoices;
}

// 4. Funciones de la Interfaz (UI)

/**
 * Renderiza el tablero de pictogramas
 */
function renderGrid() {
    const grid = document.getElementById('pictogram-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Limpiar grid

    initialVocabulary.forEach(item => {
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat}`;
        
        // Estructura de la tarjeta: Imagen + Texto
        card.innerHTML = `
            <div class="picto-img-container">
                <img src="assets/pics/${item.img}" alt="${item.label}" 
                     onerror="this.src='https://via.placeholder.com/120?text=${item.label}'">
            </div>
            <span class="picto-label">${item.label}</span>
        `;
        
        // Evento al tocar (Feedback háptico visual implementado en CSS)
        card.addEventListener('click', () => addToPhrase(item));
        grid.appendChild(card);
    });
}

/**
 * Añade un elemento a la tira de frases superior
 */
function addToPhrase(item) {
    state.currentPhrase.push(item);
    renderPhraseBar();
    
    // Feedback sonoro inmediato (Opcional, pre-TTS)
    speak(item.voice);
}

/**
 * Renderiza la tira de frases superior (Basado en libro_movil_frases.pdf)
 */
function renderPhraseBar() {
    const phraseContainer = document.getElementById('current-phrase');
    phraseContainer.innerHTML = '';

    state.currentPhrase.forEach((item, index) => {
        const picto = document.createElement('div');
        picto.className = 'phrase-item';
        picto.innerHTML = `<img src="assets/pics/${item.img}" 
                               onerror="this.src='https://via.placeholder.com/50?text=${item.label}'">`;
        
        // Permitir borrar un elemento específico al tocarlo en la barra
        picto.onclick = () => {
            state.currentPhrase.splice(index, 1);
            renderPhraseBar();
        };
        
        phraseContainer.appendChild(picto);
    });
}

/**
 * Función para reproducir la frase completa o palabras sueltas
 */
function speak(text) {
    if (synth.speaking) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.language === 'es' ? 'es-ES' : 'en-US';
    // Buscamos una voz amigable si existe
    const spanishVoice = state.voices.find(v => v.lang.includes('es'));
    if (spanishVoice) utterance.voice = spanishVoice;
    
    synth.speak(utterance);
}

/**
 * Limpia toda la frase
 */
function clearAll() {
    state.currentPhrase = [];
    renderPhraseBar();
}

// 5. Event Listeners y Configuración Inicial
document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    
    // Botón de borrar (✖)
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.onclick = clearAll;

    // Selector de Idioma (Modularidad futura)
    const langSelect = document.getElementById('lang-selector');
    if (langSelect) {
        langSelect.onchange = (e) => {
            state.language = e.target.value;
            console.log(`Idioma cambiado a: ${state.language}`);
            // Aquí llamarías a loadLanguage(state.language) en el futuro
        };
    }
});

// Registrar Service Worker para funcionamiento Offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Dótir Offline Ready'))
            .catch(err => console.log('Error en SW:', err));
    });
}