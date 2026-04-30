const rawFiles = ["abeja", "abrazo", "adiós", "ahora", "antes", "autobús", "avión", "ayuda", "bicicleta", "bien", "brazo", "caballo", "cabeza", "cansado", "caracol", "coche", "curita", "después", "dibujar", "diente", "dolor", "enfadado", "escuchar", "escuela", "espalda", "estomago", "farola", "fiebre", "flor", "frutería", "garganta", "gato", "gracias", "hola", "hospital", "jarabe", "kiosco", "lavar", "lluvia", "mal", "mano", "mareo", "mariposa", "miedo", "más", "no quiero", "no", "oler", "oído", "panadería", "papelera", "parque", "paso de cebra", "pastilla", "perro", "pez", "pie", "pierna", "poco", "por favor", "pájaro", "semáforo", "Sol", "solicitar permiso", "suave", "sí", "termómetro", "tocar", "tos", "tren", "triste", "vaca", "vacuna", "ver", "vómito", "yo quiero", "árbol"];

let favorites = JSON.parse(localStorage.getItem('dotir_favs')) || [];
let currentPhrase = [];
let activeFilter = 'favs';

function getCategory(name) {
    const n = name.toLowerCase();
    if (n === "yo quiero") return "subject";
    if (["dibujar", "lavar", "oler", "tocar", "ver", "escuchar", "solicitar permiso", "abrazo"].includes(n)) return "action";
    if (["cabeza", "fiebre", "dolor", "vómito", "tos", "mareo", "garganta", "brazo", "pierna", "estomago", "oído", "pie", "mano", "espalda", "diente", "curita", "pastilla", "jarabe", "vacuna", "termómetro"].includes(n)) return "medical";
    if (["bien", "mal", "gracias", "hola", "adiós", "ayuda", "por favor", "sí", "no", "no quiero", "triste", "enfadado", "cansado", "miedo", "suave"].includes(n)) return "social";
    if (["hospital", "escuela", "frutería", "kiosco", "panadería", "parque", "paso de cebra", "farola", "papelera", "semáforo"].includes(n)) return "place";
    return "noun";
}

const vocabulary = rawFiles.map(file => ({
    id: file, label: file.toUpperCase(), img: `assets/pics/${file}.png`, voice: file, cat: getCategory(file)
}));

function navigateTo(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`view-${view}`);
    if (target) {
        target.classList.remove('hidden');
        if (view === 'saac') setTimeout(renderSAAC, 50);
    }
}

function filterCategory(cat) {
    activeFilter = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        btn.classList.toggle('active', onclickAttr.includes(`'${cat}'`));
    });
    renderSAAC();
}

function renderSAAC() {
    const grid = document.getElementById('pictogram-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    let filtered;
    if (activeFilter === 'all') filtered = vocabulary;
    else if (activeFilter === 'favs') filtered = vocabulary.filter(v => favorites.includes(v.id));
    else filtered = vocabulary.filter(v => v.cat === activeFilter);
    
    if (activeFilter === 'favs' && filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No hay favoritos. <br>Mantén pulsado un icono para añadirlo.</p>';
        return;
    }

    filtered.forEach(item => {
        const isFav = favorites.includes(item.id);
        const card = document.createElement('div');
        card.className = `picto-card cat-${item.cat} ${isFav ? 'is-fav' : ''}`;
        card.innerHTML = `<div class="fav-star">⭐</div><img src="${item.img}" onerror="this.src='https://via.placeholder.com/100?text=${item.label}'"><span class="picto-label">${item.label}</span>`;

        let timer;
        card.onmousedown = card.ontouchstart = () => timer = setTimeout(() => toggleFavorite(item.id), 800);
        card.onmouseup = card.ontouchend = card.onmouseleave = () => clearTimeout(timer);
        
        card.onclick = () => {
            currentPhrase.push(item);
            updatePhraseDisplay();
            speak(item.voice);
        };
        grid.appendChild(card);
    });
}

function toggleFavorite(id) {
    if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
    else favorites.push(id);
    localStorage.setItem('dotir_favs', JSON.stringify(favorites));
    renderSAAC();
    if (navigator.vibrate) navigator.vibrate(50);
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

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'es-ES';
    window.speechSynthesis.speak(msg);
}

function speakPhrase() { if (currentPhrase.length > 0) speak(currentPhrase.map(i => i.voice).join(' ')); }
function clearPhrase() { currentPhrase = []; updatePhraseDisplay(); }

function accessSettings() {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    if (prompt(`Suma ${n1} + ${n2}`) == (n1 + n2)) navigateTo('settings');
}

async function downloadAllAssets() {
    const status = document.getElementById('status-msg');
    status.innerText = "Descargando...";
    const cache = await caches.open('dotir-v1');
    await cache.addAll(['index.html', 'styles.css', 'app.js', ...vocabulary.map(v => v.img)]);
    status.innerText = "✅ Listo";
}

async function clearAppData() {
    if (confirm("¿Limpiar todo?")) {
        localStorage.clear();
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
        location.reload();
    }
}