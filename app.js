const rawFiles = [
    "abeja", "abrazo", "adiós", "ahora", "antes", "autobús", "avión", "ayuda", "bicicleta", "bien", "brazo", "caballo", "cabeza", "cansado", "caracol", "coche", "curita", "después", "dibujar", "diente", "dolor", "enfadado", "escuchar", "escuela", "espalda", "estomago", "farola", "fiebre", "flor", "frutería", "garganta", "gato", "gracias", "hola", "hospital", "jarabe", "kiosco", "lavar", "lluvia", "mal", "mano", "mareo", "mariposa", "miedo", "más", "no quiero", "no", "oler", "oído", "panadería", "papelera", "parque", "paso de cebra", "pastilla", "perro", "pez", "pie", "pierna", "poco", "por favor", "pájaro", "semáforo", "Sol", "solicitar permiso", "suave", "sí", "termómetro", "tocar", "tos", "tren", "triste", "vaca", "vacuna", "ver", "vómito", "yo quiero", "árbol"
];

function getCategory(name) {
    const n = name.toLowerCase();
    if (["yo quiero"].includes(n)) return "subject";
    if (["dibujar", "lavar", "oler", "tocar", "ver", "escuchar", "solicitar permiso", "abrazo"].includes(n)) return "action";
    if (["cabeza", "fiebre", "dolor", "vómito", "tos", "mareo", "garganta", "brazo", "pierna", "estomago", "oído", "pie", "mano", "espalda", "diente", "curita", "pastilla", "jarabe", "vacuna", "termómetro"].includes(n)) return "medical";
    if (["bien", "mal", "gracias", "hola", "adiós", "ayuda", "por favor", "sí", "no", "no quiero", "triste", "enfadado", "cansado", "miedo", "suave"].includes(n)) return "social";
    if (["hospital", "escuela", "frutería", "kiosco", "panadería", "parque", "paso de cebra", "farola", "papelera", "semáforo"].includes(n)) return "place";
    return "noun";
}

const vocabulary = rawFiles.map(file => ({
    id: file,
    label: file.toUpperCase(),
    img: `assets/pics/${file}.png`,
    voice: file,
    cat: getCategory(file)
}));

let currentPhrase = [];
let activeFilter = 'all';

function navigateTo(view) {
    document.getElementById('view-menu').classList.toggle('hidden', view !== 'menu');
    document.getElementById('view-module').classList.toggle('hidden', view !== 'saac');
    if (view === 'saac') renderSAAC();
}

function filterCategory(cat) {
    activeFilter = cat;
    // Actualizar UI de botones
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === cat || (cat === 'all' && btn.innerText === 'TODOS'));
    });
    renderSAAC();
}

function renderSAAC() {
    const grid = document.getElementById('pictogram-grid');
    grid.innerHTML = '';
    
    const filtered = activeFilter === 'all' ? vocabulary : vocabulary.filter(v => v.cat === activeFilter);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat}`;
        card.innerHTML = `
            <img src="${item.img}" onerror="this.src='https://via.placeholder.com/100?text=${item.label}'">
            <span class="picto-label">${item.label}</span>
        `;
        card.onclick = () => {
            currentPhrase.push(item);
            updatePhraseDisplay();
            speak(item.voice);
        };
        grid.appendChild(card);
    });
}

function updatePhraseDisplay() {
    const display = document.getElementById('current-phrase');
    display.innerHTML = '';
    currentPhrase.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = item.img;
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
    if (currentPhrase.length > 0) speak(currentPhrase.map(i => i.voice).join(' '));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clear-btn').onclick = () => { currentPhrase = []; updatePhraseDisplay(); };
});