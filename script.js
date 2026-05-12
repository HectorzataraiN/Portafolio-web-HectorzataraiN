/**
 * script.js — Alex Mora Portfolio
 *
 * Este archivo controla toda la interacción del sitio web.
 *
 * 📌 Divide la lógica en módulos:
 * 1. Nav → menú, scroll spy, efectos del navbar
 * 2. ScrollReveal → animaciones al hacer scroll
 * 3. ContactForm → formulario con feedback visual
 * 4. Init → arranque del sistema
 */

'use strict';
// Activa modo estricto en JavaScript
// 👉 Hace el código más seguro y evita errores silenciosos


/* ========================================================================== 
   1. MÓDULO — NAVEGACIÓN
   ========================================================================== */

/**
 * 🔹 Esto es una "IIFE" (Immediately Invoked Function Expression)
 * Es una función que se ejecuta sola y crea un "módulo privado"
 *
 * 👉 ¿Por qué se usa?
 * - Evita que variables contaminen el global scope
 * - Organiza el código como bloques independientes
 */

const Nav = (() => {

  // =========================
  // 🔍 ELEMENTOS DEL DOM
  // =========================
  // Aquí estamos "capturando" elementos del HTML para poder usarlos en JS

  const navbar      = document.getElementById('navbar');
  // 👉 Barra superior completa del sitio

  const navLinks    = document.getElementById('navLinks');
  // 👉 Contenedor de links del menú

  const hamburger   = document.getElementById('hamburger');
  // 👉 Botón de menú en móvil (☰)

  const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  // 👉 Todos los links excepto el botón destacado de contacto

  const sections    = document.querySelectorAll('section');
  // 👉 Todas las secciones del HTML (home, about, etc.)


  // =========================
  // 🍔 MENÚ MÓVIL
  // =========================

  /**
   * Abre o cierra el menú en móvil
   * toggle() = si existe la clase la quita, si no la pone
   */
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');

    // aria-expanded mejora accesibilidad (lectores de pantalla)
    hamburger.setAttribute('aria-expanded', isOpen);
  }


  /**
   * Cierra el menú cuando el usuario hace click en un link
   */
  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }


  // =========================
  // 📍 SCROLL SPY
  // =========================

  /**
   * 🔹 IntersectionObserver:
   * Es una API del navegador que detecta
   * cuándo un elemento entra o sale de pantalla
   *
   * 👉 Aquí se usa para saber qué sección está visible
   */
  function initScrollSpy() {

    const spyObserver = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          // Si la sección no está visible, no hacemos nada
          if (!entry.isIntersecting) return;

          // Recorremos todos los links del menú
          allNavLinks.forEach((link) => {

            // Comparamos link con sección visible
            const isActive =
              link.getAttribute('href') === `#${entry.target.id}`;

            // Si coincide, lo resaltamos visualmente
            link.style.color = isActive ? 'var(--text)' : '';
          });

        });

      },
      {
        threshold: 0.5
        // 👉 La sección se considera activa cuando está al 50% visible
      }
    );

    // Observamos cada sección del sitio
    sections.forEach((section) => spyObserver.observe(section));
  }


  // =========================
  // 📏 EFECTO NAVBAR SCROLL
  // =========================

  /**
   * Cambia el borde del navbar cuando el usuario baja
   * para dar efecto de profundidad
   */
  function initScrollBorder() {

    window.addEventListener('scroll', () => {

      const scrolled = window.scrollY > 50;
      // 👉 Si el usuario bajó más de 50px

      navbar.style.borderBottomColor = scrolled
        ? 'rgba(255,255,255,0.07)'
        : 'rgba(255,255,255,0.04)';

    }, { passive: true });
    // 👉 "passive" mejora rendimiento del scroll
  }


  // =========================
  // 🚀 INICIALIZACIÓN DEL MÓDULO
  // =========================

  /**
   * Aquí conectamos eventos con funciones
   * Es el "arranque" del módulo Nav
   */
    function init() {

      if (hamburger && navLinks) {

        hamburger.addEventListener('click', toggleMenu);

        navLinks.querySelectorAll('a').forEach((link) =>
          link.addEventListener('click', closeMenu)
        );

      }

      initScrollSpy();
      initScrollBorder();

    }

  return { init };

})();


/* ========================================================================== 
   2. MÓDULO — SCROLL REVEAL
   ========================================================================== */

/**
 * 🔹 Este módulo anima elementos cuando aparecen en pantalla
 * Ej: textos que se deslizan o aparecen suavemente
 */

const ScrollReveal = (() => {

  const SELECTOR  = '.reveal';
  // Elementos que serán animados

  const CLASS_IN  = 'visible';
  // Clase que activa la animación

  const OPTIONS   = {
    threshold: 0.12,
    // 👉 Se activa cuando 12% del elemento es visible

    rootMargin: '0px 0px -40px 0px'
    // 👉 Empieza la animación un poco antes de entrar en pantalla
  };


  function init() {

    const elements = document.querySelectorAll(SELECTOR);

    if (!elements.length) return;
    // 👉 Si no hay elementos, no hace nada

    const observer = new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        // Agrega clase para animar
        entry.target.classList.add(CLASS_IN);

        // Solo anima una vez
        observer.unobserve(entry.target);

      });

    }, OPTIONS);

    elements.forEach((el) => observer.observe(el));
  }

  return { init };

})();


/* ========================================================================== 
   3. MÓDULO — FORMULARIO DE CONTACTO
   ========================================================================== */

/**
 * Controla el formulario:
 * - Cambia estados del botón
 * - Simula envío
 * - Da feedback visual
 */

const ContactForm = (() => {

  const FORM_ID = 'contactForm';
  const BTN_ID  = 'submitBtn';

  // Estados del botón (diferentes “momentos” visuales)
  const STATES = {
    idle: {
      text: 'Enviar mensaje →',
      bg: '',
      opacity: '1',
      disabled: false
    },

    loading: {
      text: 'Enviando...',
      bg: '',
      opacity: '0.7',
      disabled: true
    },

    success: {
      text: '✓ Mensaje enviado',
      bg: '#00ffb3',
      opacity: '1',
      disabled: true
    },
  };


  /**
   * Cambia el estilo del botón según el estado
   */
  function applyState(btn, state) {
    const s = STATES[state];

    btn.textContent      = s.text;
    btn.style.background = s.bg;
    btn.style.opacity    = s.opacity;
    btn.disabled         = s.disabled;
  }


  /**
   * Maneja el envío del formulario
   * event.preventDefault() evita recargar la página
   */
  // Busca el formulario solo en las paginas donde existe.
  // formacion.html no tiene formulario, asi que esta validacion evita errores.
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function () {
      const btn = document.getElementById("submitBtn");

      btn.textContent = "Enviando...";
      btn.disabled = true;

      setTimeout(() => {
    btn.textContent = "Mensaje enviado ✔";
      }, 800);
    });
  }


  function init() {
    const form = document.getElementById(FORM_ID);
    if (!form) return;
  }

  return { init };

})();


/* ========================================================================== 
   4. INICIALIZACIÓN GENERAL
   ========================================================================== */

/**
 * Esta función arranca todo el sitio web
 * Se ejecuta cuando el HTML ya está cargado
 */
function init() {
  Nav.init();
  ScrollReveal.init();
  ContactForm.init();
}

// Ejecuta todo el sistema
init();
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  // guardar preferencia
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }
});
document.addEventListener("DOMContentLoaded", () => {

  const dropdown = document.querySelector(".dropdown");
  const dropdownBtn = document.querySelector(".dropdown-btn");

  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", () => {
      dropdown.classList.toggle("active");
    });
  }

});
/* ==========================================================================
   TABS — PROYECTOS POR TECNOLOGÍA
   
   Lógica:
   1. Al hacer click en un tab, quitamos "active" de todos
   2. Añadimos "active" al tab clickeado
   3. Ocultamos todos los paneles
   4. Mostramos solo el panel cuyo id coincide con data-target
   ========================================================================== */

(function initTechTabs() {

  // Selecciona todos los botones tab
  const tabs = document.querySelectorAll('.tech-tab');

  // Selecciona todos los paneles de contenido
  const panels = document.querySelectorAll('.tech-panel');

  // Si no hay tabs en la página, no hace nada
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {

      // ── Paso 1: Desactivar todos los tabs ──
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      // ── Paso 2: Ocultar todos los paneles ──
      panels.forEach((p) => p.classList.remove('active'));

      // ── Paso 3: Activar el tab clickeado ──
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // ── Paso 4: Mostrar el panel correspondiente ──
      // data-target en el botón debe coincidir con el id del panel
      const targetId = tab.dataset.target;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');

    });
  });
})();
let currentImages = [];
let currentIndex = 0;

function openModal(imageSrc) {

  document.getElementById("projectModal").style.display = "flex";

  currentImages = [imageSrc];
  currentIndex = 0;

  updateImage();

  hideGalleryButtons();
}

function openGallery(images) {

  document.getElementById("projectModal").style.display = "flex";

  currentImages = images;
  currentIndex = 0;

  updateImage();

  showGalleryButtons();
}

function updateImage() {

  document.getElementById("modalImage").src =
    currentImages[currentIndex];
}

function nextImage() {

  currentIndex++;

  if (currentIndex >= currentImages.length) {
    currentIndex = 0;
  }

  updateImage();
}

function prevImage() {

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = currentImages.length - 1;
  }

  updateImage();
}

function closeModal() {

  document.getElementById("projectModal").style.display = "none";
}

function showGalleryButtons() {

  document.querySelector(".prev-btn").style.display = "block";

  document.querySelector(".next-btn").style.display = "block";
}

function hideGalleryButtons() {

  document.querySelector(".prev-btn").style.display = "none";

  document.querySelector(".next-btn").style.display = "none";
}

window.onclick = function(event) {

  const modal = document.getElementById("projectModal");

  if (event.target === modal) {
    closeModal();
  }
}
