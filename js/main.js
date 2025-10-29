// Basic interactivity: nav toggle, theme toggle, year
document.addEventListener('DOMContentLoaded', function(){
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');

  toggle && toggle.addEventListener('click', () => {
    nav.classList.toggle('show');
  });

  // Theme toggle (light/dark) — simple implementation that toggles a class on body
  themeToggle && themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if(document.body.classList.contains('dark')){
      document.documentElement.style.setProperty('--bg','#071129');
      document.documentElement.style.setProperty('--text','#f8fafc');
      document.documentElement.style.setProperty('--card','#0b1220');
      document.documentElement.style.setProperty('--muted','#9aa6b2');
      themeToggle.textContent = '☀️';
    } else {
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--text');
      document.documentElement.style.removeProperty('--card');
      document.documentElement.style.removeProperty('--muted');
      themeToggle.textContent = '🌙';
    }
  });

  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Simple client-side form validation (optional)
  const form = document.getElementById('signup-form');
  if(form){
    form.addEventListener('submit', (e) => {
      const email = form.querySelector('input[name="email"]');
      if(email && !email.value.includes('@')){
        e.preventDefault();
        alert('Please enter a valid email address.');
        email.focus();
      }
    });
  }
});