import { AuthService } from '../services/auth.js';
import { isSupabaseConfigured } from '../services/supabaseClient.js';
import { openSupabaseConfigModal } from './modals.js';
import { showToast } from './toast.js';

const icon = (content, className = '') => `<svg class="${className}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
const mailIcon = icon('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>');
const keyIcon = icon('<circle cx="8" cy="9" r="4"/><path d="m11 12 9 9m-5-5 3-3m-6 0 3-3"/>');
const eyeIcon = icon('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>');
const eyeOffIcon = icon('<path d="m3 3 18 18M10.6 5.1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3 3.7M6.3 6.3A22 22 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.7-1.6M10 10a3 3 0 0 0 4 4"/>');
const cloudIcon = icon('<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 20 10a4 4 0 0 1-1 8Z"/>');
const arrowIcon = icon('<path d="M5 12h14m-5-5 5 5-5 5"/>');

export function renderLogin() {
  const isCloud = isSupabaseConfigured();

  return `
    <main class="login-wrapper">
      <section class="login-card" aria-labelledby="login-title">
        <header class="login-heading">
          <h1 id="login-title">Chick<span>Pence</span><span class="login-brand-dot">.</span></h1>
          <p>Log in to your flock.</p>
        </header>

        <div class="login-mascot-scene">
          <span class="login-greeting" aria-hidden="true">Hi there!</span>
          <img class="login-mascot" src="/images/chicken-mascot.png" alt="A friendly golden chicken waving hello" width="200" height="200" fetchpriority="high" />
        </div>

        <form id="login-form" class="login-form">
          <div id="login-error-msg" class="login-error" role="alert" style="display: none;"></div>
          <label class="login-field">
            <span class="login-sr-only">Email / Username</span>
            ${mailIcon}
            <input id="login-email" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="${isCloud ? 'Email address' : 'Email / Username'}" required />
          </label>
          <label class="login-field login-password-field">
            <span class="login-sr-only">Password</span>
            ${keyIcon}
            <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Password" ${isCloud ? 'required' : ''} />
            <button class="login-password-toggle" id="btn-toggle-password" type="button" aria-label="Show password" aria-pressed="false">${eyeIcon}</button>
          </label>
          <button class="login-button login-submit" id="btn-submit-login" type="submit">
            <span>Log in</span>${arrowIcon}
          </button>
        </form>

        <div class="login-divider"><span>or</span></div>
        <button class="login-button login-demo" id="btn-quick-demo" type="button">Instant Demo Mode</button>
        <p class="login-demo-note">A little peek. No account needed.</p>

        <footer class="login-card-footer">
          <button class="login-cloud" id="btn-login-cloud-settings" type="button">
            ${cloudIcon}<span>${isCloud ? 'Supabase Connected' : 'Connect Supabase Cloud'}</span>
          </button>
          <p>Poultry Cost &amp; Profitability Analysis</p>
        </footer>
      </section>
      <p class="login-prototype">Thesis Prototype (BSCS, PLM) <span aria-hidden="true">·</span> Offline-First PWA</p>
    </main>
  `;
}

export function attachLoginListeners(container, onLoginSuccess) {
  const form = container.querySelector('#login-form');
  const emailInput = container.querySelector('#login-email');
  const passInput = container.querySelector('#login-password');
  const errorMsg = container.querySelector('#login-error-msg');
  const submitBtn = container.querySelector('#btn-submit-login');
  const demoBtn = container.querySelector('#btn-quick-demo');
  const cloudBtn = container.querySelector('#btn-login-cloud-settings');
  const toggleBtn = container.querySelector('#btn-toggle-password');
  let isLoggingIn = false;

  const handleLogin = async (demo = false) => {
    if (isLoggingIn) return;
    isLoggingIn = true;
    const activeBtn = demo ? demoBtn : submitBtn;
    const originalContent = activeBtn.innerHTML;
    try {
      submitBtn.disabled = demoBtn.disabled = cloudBtn.disabled = true;
      activeBtn.textContent = demo ? 'Opening demo…' : 'Logging in…';
      form.setAttribute('aria-busy', 'true');
      errorMsg.style.display = 'none';

      if (demo) await AuthService.loginDemo();
      else await AuthService.login(emailInput.value, passInput.value);
      showToast(demo ? 'Logged in as Demo Encoder' : 'Logged in successfully');
      await onLoginSuccess();
    } catch (err) {
      errorMsg.textContent = err.message || 'Login failed. Please check your credentials and try again.';
      errorMsg.style.display = 'block';
    } finally {
      isLoggingIn = false;
      submitBtn.disabled = demoBtn.disabled = cloudBtn.disabled = false;
      activeBtn.innerHTML = originalContent;
      form.removeAttribute('aria-busy');
    }
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    handleLogin();
  });
  toggleBtn?.addEventListener('click', () => {
    const reveal = passInput.type === 'password';
    passInput.type = reveal ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    toggleBtn.setAttribute('aria-pressed', String(reveal));
    toggleBtn.innerHTML = reveal ? eyeOffIcon : eyeIcon;
  });
  demoBtn?.addEventListener('click', () => handleLogin(true));
  cloudBtn?.addEventListener('click', () => {
    openSupabaseConfigModal(() => {
      container.innerHTML = renderLogin();
      attachLoginListeners(container, onLoginSuccess);
    });
  });
}
