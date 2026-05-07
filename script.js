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

    // Click en hamburguesa abre menú
    hamburger.addEventListener('click', toggleMenu);

    // Click en cualquier link cierra el menú
    navLinks.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', closeMenu)
    );

    // Activamos scroll spy
    initScrollSpy();

    // Activamos efecto del navbar
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
document.getElementById("contactForm").addEventListener("submit", function () {
  const btn = document.getElementById("submitBtn");

  btn.textContent = "Enviando...";
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = "Mensaje enviado ✔";
  }, 800);
});


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