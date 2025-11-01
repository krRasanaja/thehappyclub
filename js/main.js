const THEME_STORAGE_KEY = 'the-happy-club-theme';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('signup-form');
  const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];

  // Helper to persist theme choice safely
  const safeStorage = {
    get() {
      try {
        return localStorage.getItem(THEME_STORAGE_KEY);
      } catch (err) {
        return null;
      }
    },
    set(value) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, value);
      } catch (err) {
        // Ignore storage errors (e.g. Safari private mode)
      }
    }
  };

  const applyTheme = (mode, persist = true) => {
    const isDark = mode === 'dark';
    document.body.classList.toggle('dark', isDark);
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeToggle) {
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (persist) {
      safeStorage.set(isDark ? 'dark' : 'light');
    }
  };

  const storedTheme = safeStorage.get();
  const hasStoredPreference = storedTheme === 'dark' || storedTheme === 'light';
  const startingTheme = hasStoredPreference
    ? storedTheme
    : (prefersDark && prefersDark.matches ? 'dark' : 'light');
  applyTheme(startingTheme, false);

  if (prefersDark) {
    prefersDark.addEventListener('change', evt => {
      if (!safeStorage.get()) {
        applyTheme(evt.matches ? 'dark' : 'light', false);
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isOpen.toString());
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          closeNav();
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  if (nav && navLinks.length && 'IntersectionObserver' in window) {
    const sections = navLinks
      .map(link => {
        try {
          return document.querySelector(link.getAttribute('href'));
        } catch (err) {
          return null;
        }
      })
      .filter((section) => section instanceof HTMLElement);

    const setActiveLink = (id) => {
      navLinks.forEach(link => {
        const target = link.getAttribute('href');
        link.classList.toggle('is-active', target === id);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(`#${entry.target.id}`);
        }
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      const email = form.querySelector('input[name="email"]');
      const name = form.querySelector('input[name="name"]');

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        event.preventDefault();
        alert('Please enter a valid email address so we can keep in touch.');
        email.focus();
        return;
      }

      if (name && name.value.trim().length < 2) {
        event.preventDefault();
        alert('Please share your full name so we can greet you properly.');
        name.focus();
      }
    });
  }
});
