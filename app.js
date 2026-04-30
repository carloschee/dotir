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
    id: file, label: file.toUpperCase(), img: `assets/pics/${file}.png`, voice: file, cat: getCategory(file)
}));

let currentPhrase = [];
let activeFilter = 'all';

function navigateTo(view) {
    const views = ['view-menu', 'view-module', 'view-settings'];
    views.forEach(v => document.getElementById(v).classList.add('hidden'));
    document.getElementById(`view-${view}`).classList.remove('hidden');
    if (view === 'saac') renderSAAC();
}

function accessSettings() {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    const answer = prompt(`RETO DE SEGURIDAD:\n¿Cuánto es ${n1} + ${n2}?`);
    if (parseInt(answer) === (n1 + n2)) navigateTo('settings');
}

function filterCategory(cat) {
    activeFilter = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        const btnText = btn.innerText.toLowerCase();
        btn.classList.toggle('active', btnText === cat || (cat === 'all' && btnText === 'todos'));
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
        card.innerHTML = `<img src="${item.img}" onerror="this.src='https://via.placeholder.com/100?text=${item.label}'"><span class="picto-label">${item.label}</span>`;
        card.onclick = () => { currentPhrase.push(item); updatePhraseDisplay(); speak(item.voice); };
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

async function downloadAllAssets() {
    const status = document.getElementById('status-msg');
    const fill = document.getElementById('progress-fill');
    document.getElementById('download-progress').classList.remove('hidden');
    const urls = ['index.html', 'styles.css', 'app.js', ...vocabulary.map(v => v.img)];
    const cache = await caches.open('dotir-v1');
    for (let i = 0; i < urls.length; i++) {
        await cache.add(urls[i]).catch(e => console.log("Error en:", urls[i]));
        fill.style.width = `${Math.round(((i + 1) / urls.length) * 100)}%`;
        status.innerText = `Descargando: ${i + 1} de ${urls.length}`;
    }
    status.innerText = "✅ App lista para usar sin conexión.";
}

async function clearAppData() {
    if (confirm("¿Borrar caché y actualizar desde el servidor?")) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
        window.location.reload(true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('clear-btn').onclick = () => { currentPhrase = []; updatePhraseDisplay(); };
});