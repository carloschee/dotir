const vocabulary = [
    { id: 'yo', cat: 'subject', label: 'Yo', img: 'yo.png', voice: 'Yo' },
    { id: 'quiero', cat: 'action', label: 'Quiero', img: 'quiero.png', voice: 'quiero' },
    { id: 'comer', cat: 'action', label: 'Comer', img: 'comer.png', voice: 'comer' },
    { id: 'beber', cat: 'action', label: 'Beber', img: 'beber' },
    { id: 'agua', cat: 'noun', label: 'Agua', img: 'agua.png', voice: 'agua' },
    { id: 'banio', cat: 'noun', label: 'Baño', img: 'banio.png', voice: 'ir al baño' },
    { id: 'jugar', cat: 'action', label: 'Jugar', img: 'jugar.png', voice: 'jugar' },
    { id: 'pelota', cat: 'noun', label: 'Pelota', img: 'pelota.png', voice: 'la pelota' },
    { id: 'duele', cat: 'medical', label: 'Duele', img: 'dolor.png', voice: 'me duele' },
    { id: 'cabeza', cat: 'medical', label: 'Cabeza', img: 'cabeza.png', voice: 'la cabeza' },
    { id: 'mama', cat: 'subject', label: 'Mamá', img: 'mama.png', voice: 'mamá' },
    { id: 'papa', cat: 'subject', label: 'Papá', img: 'papa.png', voice: 'papá' },
    { id: 'dormir', cat: 'action', label: 'Dormir', img: 'dormir.png', voice: 'dormir' },
    { id: 'feliz', cat: 'social', label: 'Feliz', img: 'feliz.png', voice: 'estoy feliz' },
    { id: 'triste', cat: 'social', label: 'Triste', img: 'triste.png', voice: 'estoy triste' }
];

let currentPhrase = [];

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
    }
}

function renderSAAC() {
    const grid = document.getElementById('pictogram-grid');
    grid.innerHTML = '';
    vocabulary.forEach(item => {
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat}`;
        card.innerHTML = `
            <img src="assets/pics/${item.img}" onerror="this.src='https://via.placeholder.com/80?text=${item.label}'">
            <span class="picto-label">${item.label}</span>
        `;
        card.onclick = (e) => {
            e.preventDefault(); // Evita interferencia con scroll
            addToPhrase(item);
        };
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
        img.onerror = (e) => e.target.src = `https://via.placeholder.com/50?text=${item.label}`;
        img.onclick = () => { currentPhrase.splice(index, 1); updatePhraseDisplay(); };
        display.appendChild(img);
    });
}

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'es-ES';
    window.speechSynthesis.speak(msg);
}

function speakPhrase() {
    speak(currentPhrase.map(i => i.voice).join(' '));
}

// SOLUCIÓN PARA IPHONE: Prevenir el bloqueo de scroll
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.scrollable') || e.target.closest('#pictogram-grid')) {
        // Permitimos el scroll solo en estos elementos
    } else {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('clear-btn');
    if (btn) btn.onclick = () => { currentPhrase = []; updatePhraseDisplay(); };
});