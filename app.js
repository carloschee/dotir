const vocabulary = [
    { id: 'yo', cat: 'subject', label: 'Yo', img: 'yo.png', voice: 'Yo' },
    { id: 'quiero', cat: 'action', label: 'Quiero', img: 'quiero.png', voice: 'quiero' },
    { id: 'comer', cat: 'action', label: 'Comer', img: 'comer.png', voice: 'comer' },
    { id: 'beber', cat: 'action', label: 'Beber', img: 'beber.png', voice: 'beber' },
    { id: 'banio', cat: 'noun', label: 'Baño', img: 'banio.png', voice: 'ir al baño' },
    { id: 'agua', cat: 'noun', label: 'Agua', img: 'agua.png', voice: 'agua' },
    { id: 'jugar', cat: 'action', label: 'Jugar', img: 'jugar.png', voice: 'jugar' },
    { id: 'pelota', cat: 'noun', label: 'Pelota', img: 'pelota.png', voice: 'la pelota' },
    { id: 'duele', cat: 'medical', label: 'Duele', img: 'dolor.png', voice: 'me duele' },
    { id: 'ayuda', cat: 'social', label: 'Ayuda', img: 'ayuda.png', voice: 'ayuda' },
    { id: 'si', cat: 'social', label: 'Sí', img: 'si.png', voice: 'sí' },
    { id: 'no', cat: 'social', label: 'No', img: 'no.png', voice: 'no' },
    { id: 'papa', cat: 'subject', label: 'Papá', img: 'papa.png', voice: 'papá' },
    { id: 'mama', cat: 'subject', label: 'Mamá', img: 'mama.png', voice: 'mamá' },
    { id: 'dormir', cat: 'action', label: 'Dormir', img: 'dormir.png', voice: 'dormir' }
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
    if (!grid) return;
    grid.innerHTML = '';
    vocabulary.forEach(item => {
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat}`;
        card.innerHTML = `
            <img src="assets/pics/${item.img}" onerror="this.src='https://via.placeholder.com/80?text=${item.label}'">
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
    if (!display) return;
    display.innerHTML = '';
    currentPhrase.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = `assets/pics/${item.img}`;
        img.onerror = (e) => e.target.src = `https://via.placeholder.com/50?text=${item.label}`;
        img.onclick = (e) => {
            e.stopPropagation();
            currentPhrase.splice(index, 1);
            updatePhraseDisplay();
        };
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
    if (currentPhrase.length === 0) return;
    speak(currentPhrase.map(i => i.voice).join(' '));
}

document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.onclick = () => { currentPhrase = []; updatePhraseDisplay(); };
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}