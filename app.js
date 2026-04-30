const rawFiles = ["abeja", "abrazo", "adiós", "ahora", "antes", "autobús", "avión", "ayuda", "bicicleta", "bien", "brazo", "caballo", "cabeza", "cansado", "caracol", "coche", "curita", "después", "dibujar", "diente", "dolor", "enfadado", "escuchar", "escuela", "espalda", "estomago", "farola", "fiebre", "flor", "frutería", "garganta", "gato", "gracias", "hola", "hospital", "jarabe", "kiosco", "lavar", "lluvia", "mal", "mano", "mareo", "mariposa", "miedo", "más", "no quiero", "no", "oler", "oído", "panadería", "papelera", "parque", "paso de cebra", "pastilla", "perro", "pez", "pie", "pierna", "poco", "por favor", "pájaro", "semáforo", "Sol", "solicitar permiso", "suave", "sí", "termómetro", "tocar", "tos", "tren", "triste", "vaca", "vacuna", "ver", "vómito", "yo quiero", "árbol"];

function getCategory(name) {
    const n = name.toLowerCase();
    if (n === "yo quiero") return "subject";
    if (["dibujar","lavar","oler","tocar","ver","escuchar","solicitar permiso","abrazo"].includes(n)) return "action";
    if (["cabeza","fiebre","dolor","vómito","tos","mareo","garganta","brazo","pierna","estomago","oído","pie","mano","espalda","diente","curita","pastilla","jarabe","vacuna","termómetro"].includes(n)) return "medical";
    if (["bien","mal","gracias","hola","adiós","ayuda","por favor","sí","no","no quiero","triste","enfadado","cansado","miedo","suave"].includes(n)) return "social";
    if (["hospital","escuela","frutería","kiosco","panadería","parque","paso de cebra","farola","papelera","semáforo"].includes(n)) return "place";
    return "noun";
}

const vocabulary = rawFiles.map(f => ({
    id: f, label: f.toUpperCase(), img: `assets/pics/${f}.png`, voice: f, cat: getCategory(f)
}));

let currentPhrase = [];
let activeFilter = 'all';

function navigateTo(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`view-${view}`);
    if (target) {
        target.classList.remove('hidden');
        if (view === 'saac') {
            setTimeout(renderSAAC, 50); // Pequeño retraso para asegurar que el DOM es visible
        }
    }
}

function renderSAAC() {
    const grid = document.getElementById('pictogram-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const filtered = activeFilter === 'all' ? vocabulary : vocabulary.filter(v => v.cat === activeFilter);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat}`;
        card.innerHTML = `
            <img src="${item.img}" alt="${item.label}" onerror="this.src='https://via.placeholder.com/80?text=${item.label}'">
            <div class="picto-label">${item.label}</div>
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
        img.src = item.img;
        img.onclick = () => { currentPhrase.splice(index, 1); updatePhraseDisplay(); };
        display.appendChild(img);
    });
}

function filterCategory(cat) {
    activeFilter = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.getAttribute('onclick').includes(cat)));
    renderSAAC();
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

function clearPhrase() {
    currentPhrase = [];
    updatePhraseDisplay();
}

function accessSettings() {
    const n1 = Math.floor(Math.random()*10);
    const n2 = Math.floor(Math.random()*10);
    if (prompt(`Suma ${n1} + ${n2}`) == (n1+n2)) navigateTo('settings');
}

// Service Worker / Cache (Simplificado)
async function downloadAllAssets() {
    const status = document.getElementById('status-msg');
    status.innerText = "Descargando...";
    const cache = await caches.open('dotir-v1');
    await cache.addAll(['index.html', 'styles.css', 'app.js', ...vocabulary.map(v => v.img)]);
    status.innerText = "✅ Listo";
}

async function clearAppData() {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    location.reload();
}