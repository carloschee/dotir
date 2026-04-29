const state = {
  lang: 'es',
  currentModule: 'saac',
  translations: {}
};

// Carga de traducciones desde JSON local
async function loadLanguage(lang) {
  try {
    const response = await fetch(`./locales/${lang}.json`);
    state.translations = await response.json();
    renderApp();
  } catch (err) {
    console.error("Error cargando idioma offline:", err);
  }
}

// Renderizado del Grid (Basado en lógica de tableros de comunicación)
function renderApp() {
  const grid = document.getElementById('pictogram-grid');
  // Aquí mapearíamos los pictogramas definidos en el JSON
  // Por ahora, un placeholder de carga
  grid.innerHTML = `<p>${state.translations.welcome || 'Cargando...'}</p>`;
}

document.getElementById('lang-selector').addEventListener('change', (e) => {
  loadLanguage(e.target.value);
});

// Inicialización
loadLanguage('es');