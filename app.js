/**
 * DJ EMMY - Lógica de Aplicación (v80)
 */

let seccionActual = 'inicio';

// ── 1. Navegación Principal ──────────────────────────────────────────
function cambiarSeccion(id) {
    // Ocultar inicio
    document.getElementById('menu-inicio').classList.add('hidden');
    
    // Mostrar interfaz de navegación
    document.getElementById('header-seccion').classList.remove('hidden');
    document.getElementById('main-secciones').classList.remove('hidden');

    // Ocultar todas las sub-secciones
    const secciones = ['seccion-musica', 'seccion-videos', 'seccion-libros', 'vista-comunicador'];
    secciones.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.classList.add('hidden');
    });

    // Mostrar sección elegida
    const target = document.getElementById(id) || document.getElementById(`seccion-${id}`);
    if (target) {
        target.classList.remove('hidden');
        if (id === 'vista-comunicador') target.classList.add('flex');
    }

    // FIX: Si es el comunicador, renderizar los botones inmediatamente
    if (id === 'vista-comunicador' || id === 'comunicador') {
        renderComunicador();
    }

    seccionActual = id;
    document.getElementById('titulo-seccion-activa').innerText = id.toUpperCase();
}

function volverAlMenu() {
    pararTodo();
    document.getElementById('header-seccion').classList.add('hidden');
    document.getElementById('main-secciones').classList.add('hidden');
    document.getElementById('menu-inicio').classList.remove('hidden');
}

// ── 2. Lógica del Comunicador ────────────────────────────────────────
function renderComunicador() {
    const grid = document.getElementById('grid-comunicador');
    if (!grid) return;

    // Verificar si existen datos (deben estar en data.js)
    if (typeof CATEGORIAS_COMUNICADOR === 'undefined') {
        grid.innerHTML = "<p class='p-4 opacity-50'>No se encontraron categorías.</p>";
        return;
    }

    grid.innerHTML = CATEGORIAS_COMUNICADOR.map(cat => `
        <button onclick="reproducirVoz('${cat.nombre}')" 
                class="bg-white/10 p-4 rounded-3xl border border-white/20 flex flex-col items-center gap-2 active:scale-90 transition-transform">
            <span class="text-5xl">${cat.emoji}</span>
            <span class="text-xs font-bold uppercase">${cat.nombre}</span>
        </button>
    `).join('');
}

// ── 3. Funciones de Control ──────────────────────────────────────────
function pararTodo() {
    // Detener videos
    const video = document.getElementById('reproductor-video');
    if (video) { video.pause(); video.src = ""; }
    
    // Detener audio (si existe variable global)
    if (window.audioGlobal) { window.audioGlobal.pause(); }
    
    console.log("Sistema detenido");
}

function toggleMuteSFX() {
    const silenciado = document.getElementById('dot-mute-menu').classList.toggle('bg-red-500');
    document.getElementById('dot-mute-menu').classList.toggle('bg-green-400');
    // Lógica para silenciar efectos de sonido aquí
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log("DJ Emmy inicializado correctamente.");
});