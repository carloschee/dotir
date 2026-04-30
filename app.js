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
    const views = ['view-menu', 'view-module', 'view-settings'];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(`view-${view}`);
    if (target) target.classList.remove('hidden');
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
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = activeFilter === 'all' ? vocabulary : vocabulary.filter(v => v.cat === activeFilter);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat}`;
        card.innerHTML = `
            <img src="${item.img}" alt="${item.label}" onerror="this.onerror=null; this.src='https://via.placeholder.com/100/ffffff/000000?text=${item.label}'">
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
    if (!display) return;
    display.innerHTML = '';
    currentPhrase.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = item.img;
        img.onerror = (e) => { e.target.src = `https://via.placeholder.com/50?text=${item.label}`; };
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
    if (currentPhrase.length > 0) speak(currentPhrase.map(i => i.voice).join(' '));
}

// Inicialización de botones
document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.onclick = (e) => {
            e.stopPropagation();
            currentPhrase = [];
            updatePhraseDisplay();
        };
    }
});

// Configuración Offline
async function downloadAllAssets() {
    const status = document.getElementById('status-msg');
    const fill = document.getElementById('progress-fill');
    const bar = document.getElementById('download-progress');
    if (bar) bar.classList.remove('hidden');
    
    const urls = ['index.html', 'styles.css', 'app.js', ...vocabulary.map(v => v.img)];
    try {
        const cache = await caches.open('dotir-v1');
        for (let i = 0; i < urls.length; i++) {
            await cache.add(urls[i]).catch(() => console.warn("No se pudo cachear:", urls[i]));
            if (fill) fill.style.width = `${Math.round(((i + 1) / urls.length) * 100)}%`;
            if (status) status.innerText = `Descargando: ${i + 1} de ${urls.length}`;
        }
        if (status) status.innerText = "✅ App lista para usar sin conexión.";
    } catch (e) {
        if (status) status.innerText = "❌ Error al descargar.";
    }
}

async function clearAppData() {
    if (confirm("¿Borrar caché y actualizar?")) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
        window.location.reload(true);
    }
}