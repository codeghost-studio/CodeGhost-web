// ══════════════════════════════════════════════════════════════
// AÑO DINÁMICO EN EL FOOTER
// ══════════════════════════════════════════════════════════════
// new Date().getFullYear() devuelve el año actual (2026, 2027, etc.)
// Así el copyright siempre está actualizado automáticamente.
document.getElementById('footer-year').textContent = new Date().getFullYear();


// ══════════════════════════════════════════════════════════════
// SPLASH SCREEN — Pantalla de carga con barra de progreso
// ══════════════════════════════════════════════════════════════
(function initSplash() {
  // Textos que aparecen durante la carga
  const STEPS = [
    'Inicializando entorno...',
    'Cargando módulos CSS...',
    'Compilando interfaces...',
    'Sistema listo.',
  ];

  // Referencias a los elementos del DOM que se actualizarán
  const splash   = document.getElementById('splash');
  const bar      = document.getElementById('splash-bar');
  const pct      = document.getElementById('splash-pct');
  const stepEl   = document.getElementById('splash-step');
  const doneEl   = document.getElementById('splash-done');
  const barTrack = document.getElementById('splash-bar-track');

  let progress = 0;
  const DURATION = 2000; // Duración total en milisegundos
  const TICK     = 36;   // Intervalo de actualización (ms)
  const INCREMENT = 100 / (DURATION / TICK); // Cuánto avanza en cada tick

  // setInterval ejecuta la función cada TICK ms
  const timer = setInterval(function() {
    progress += INCREMENT;

    if (progress >= 100) {
      progress = 100;
      clearInterval(timer); // Detiene el temporizador

      // Actualiza los atributos de accesibilidad de la barra
      barTrack.setAttribute('aria-valuenow', '100');

      // Muestra "SISTEMA LISTO"
      doneEl.classList.add('show');

      // Después de 600ms, oculta el splash con una transición CSS
      setTimeout(function() {
        splash.classList.add('hide');
        // Después de que termine la transición (500ms), elimina del DOM
        setTimeout(function() { splash.remove(); }, 500);
      }, 600);
    }

    // Actualiza el texto del paso según el progreso
    const stepIndex = Math.min(Math.floor(progress / 25), STEPS.length - 1);
    stepEl.textContent = STEPS[stepIndex];

    // Actualiza la barra visual y el porcentaje
    const rounded = Math.round(progress);
    bar.style.width = rounded + '%';
    pct.textContent = rounded + '%';
    barTrack.setAttribute('aria-valuenow', rounded);
  }, TICK);
})();


// ══════════════════════════════════════════════════════════════
// NAVBAR — Scroll + menú móvil
// ══════════════════════════════════════════════════════════════
(function initNavbar() {
  const header      = document.getElementById('site-header');
  const hamburger   = document.getElementById('hamburger-btn');
  const overlay     = document.getElementById('nav-overlay');
  const panel       = document.getElementById('nav-panel');
  const closeBtn    = document.getElementById('close-btn');
  const panelLinks  = document.querySelectorAll('.panel-link');

  // ── Scroll listener ───────────────────────────────────────
  // Añade la clase .scrolled cuando el usuario baja más de 10px
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true }); // passive:true mejora el rendimiento del scroll

  // ── Abrir panel ───────────────────────────────────────────
  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    // Mover el foco al primer link del panel (accesibilidad)
    panel.querySelector('a')?.focus();
    document.body.style.overflow = 'hidden'; // Bloquea el scroll del body
  }

  // ── Cerrar panel ──────────────────────────────────────────
  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.focus(); // Devuelve el foco al botón hamburguesa
    document.body.style.overflow = ''; // Restaura el scroll
  }

  hamburger.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // Cierra el panel al hacer clic en cualquier link del panel
  panelLinks.forEach(function(link) {
    link.addEventListener('click', closePanel);
  });

  // Cierra el panel con la tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
})();


// ══════════════════════════════════════════════════════════════
// MATRIX RAIN — Efecto de lluvia de código en el canvas del hero
// ══════════════════════════════════════════════════════════════
(function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');

  // Caracteres que caen — mezcla de katakana + números para el efecto "Matrix"
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
  const SIZE  = 14; // Tamaño de fuente en píxeles

  let cols, drops, lastTime = 0;

  // Ajusta el canvas al tamaño de la ventana
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // Inicializa las columnas y las gotas
  function init() {
    resize();
    cols  = Math.floor(canvas.width / SIZE);
    drops = [];
    // Cada gota empieza en una posición aleatoria negativa (arriba del viewport)
    for (let i = 0; i < cols; i++) drops[i] = Math.random() * -50;
  }

  init();

  // Dibuja un frame del efecto Matrix
  function draw() {
    // Capa semitransparente oscura — crea el efecto de estela/trail
    ctx.fillStyle = 'rgba(5,5,8,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = SIZE + 'px Space Mono, monospace';

    for (let i = 0; i < cols; i++) {
      // Carácter aleatorio de la lista
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      // Alterna entre cian y verde con probabilidad (80% cian, 20% verde)
      ctx.fillStyle = Math.random() > 0.8 ? 'rgba(0,255,136,0.8)' : 'rgba(0,245,255,0.6)';
      ctx.fillText(char, i * SIZE, drops[i] * SIZE);

      // Reinicia la gota en la parte superior cuando llega al fondo (con algo de azar)
      if (drops[i] * SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++; // Avanza la gota hacia abajo
    }
  }

  // requestAnimationFrame crea un bucle de animación sincronizado con la pantalla
  function loop(timestamp) {
    // Throttle: solo dibuja cada 40ms (≈25fps) para no sobrecargar la CPU
    if (timestamp - lastTime > 40) {
      draw();
      lastTime = timestamp;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Actualiza el número de columnas cuando cambia el tamaño de la ventana
  window.addEventListener('resize', function() {
    resize();
    cols  = Math.floor(canvas.width / SIZE);
    drops = [];
    for (let i = 0; i < cols; i++) drops[i] = Math.random() * -50;
  }, { passive: true });
})();


// ══════════════════════════════════════════════════════════════
// HERO PHRASES — Titular rotativo con animación CSS
// ══════════════════════════════════════════════════════════════
(function initHeroPhrases() {
  // Frases que rotan en el hero
  const PHRASES = [
    'Experiencias Web de Alto Impacto.',
    'Rendimiento Sin Concesiones.',
    'Animaciones que Inspiran.',
    'Arquitectura Escalable.',
  ];

  const el = document.getElementById('hero-phrase');
  let currentIndex = 0;

  // Muestra la primera frase inmediatamente
  el.textContent = PHRASES[0];
  el.classList.add('visible'); // La clase .visible activa la transición CSS

  // Función que cambia la frase con animación
  function changePhrase() {
    // 1. Oculta la frase actual (fade-out + slide up)
    el.classList.remove('visible');

    // 2. Después de que termine la animación de salida (450ms), cambia el texto
    setTimeout(function() {
      currentIndex = (currentIndex + 1) % PHRASES.length; // Avanza al siguiente (circular)
      el.textContent = PHRASES[currentIndex];

      // 3. Muestra la nueva frase (fade-in + slide down)
      // El setTimeout de 20ms evita que la transición CSS se salte
      setTimeout(function() {
        el.classList.add('visible');
      }, 20);
    }, 450);
  }

  // Cambia la frase cada 3.8 segundos
  setInterval(changePhrase, 3800);
})();


// ══════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER — Animaciones al hacer scroll
// ══════════════════════════════════════════════════════════════
// IntersectionObserver observa elementos y ejecuta una función
// cuando entran o salen del viewport (área visible de la pantalla).
// Es la alternativa nativa del navegador a whileInView de Framer Motion.
(function initScrollAnimations() {
  // Configuración del observer:
  //   threshold: 0.12 = el elemento debe ser 12% visible para activarse
  //   rootMargin: '-50px' = se activa 50px antes del borde del viewport
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      // Si el elemento es visible...
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Añade la clase que activa la animación CSS
        observer.unobserve(entry.target);      // Deja de observar (la animación solo ocurre una vez)
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '-50px 0px'
  });

  // Observa todos los elementos con la clase .anim-ready
  document.querySelectorAll('.anim-ready').forEach(function(el) {
    observer.observe(el);
  });
})();


// ══════════════════════════════════════════════════════════════
// CONTACT FORM — Manejo del formulario de contacto
// ══════════════════════════════════════════════════════════════
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const successEl  = document.getElementById('form-success');
  const errorEl    = document.getElementById('form-error');
  const errorMsg   = document.getElementById('error-msg');

  // Maneja el evento submit del formulario
  form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Evita que el navegador recargue la página

    // ── Validación básica en el cliente ────────────────────────
    // (El servidor también valida, esto es solo para UX inmediata)
    const name    = form.querySelector('#field-name').value.trim();
    const email   = form.querySelector('#field-email').value.trim();
    const subject = form.querySelector('#field-subject').value.trim();
    const message = form.querySelector('#field-message').value.trim();
    const honeypot = form.querySelector('#website-field').value; // Campo trampa

    if (!name || !email || !subject || !message) {
      showError('Por favor completa todos los campos requeridos.');
      return;
    }

    // Validación básica del formato de email con expresión regular
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('El correo electrónico no tiene un formato válido.');
      return;
    }

    // ── Estado de carga ────────────────────────────────────────
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;animation:spinCW 1s linear infinite" aria-hidden="true"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M21 12c0-4.97-4.03-9-9-9"/></svg> Enviando...';
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    try {
      // ── Envío al servidor ─────────────────────────────────────
      // fetch() hace una petición HTTP POST al backend con los datos del formulario
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, honeypot }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ── Éxito ─────────────────────────────────────────────
        form.reset(); // Limpia todos los campos
        successEl.className = 'form-status success';
        submitBtn.disabled = false;
        resetBtn();

      } else if (res.status === 429) {
        // ── Rate limit: demasiados mensajes ───────────────────
        showError('Has enviado demasiados mensajes recientemente. Intenta más tarde.');
      } else {
        showError(data.error || 'Ocurrió un error. Por favor intenta nuevamente.');
      }

    } catch (err) {
      // ── Error de red ───────────────────────────────────────
      showError('Error de conexión. Verifica tu red e intenta nuevamente.');
    }
  });

  // Muestra el mensaje de error
  function showError(msg) {
    errorMsg.textContent = msg;
    errorEl.className = 'form-status error';
    submitBtn.disabled = false;
    resetBtn();
  }

  // Restaura el texto del botón de envío
  function resetBtn() {
    submitBtn.innerHTML = 'Enviar mensaje <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  }
})();
