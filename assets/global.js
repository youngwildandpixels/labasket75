// Accordion
document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    trigger.closest('.accordion__item').classList.toggle('is-open');
  });
});

(() => {
  const desktopQuery = window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;
  let frame = null;
  let LenisClass = null;

  const shouldRun = () => desktopQuery.matches && !reduceMotionQuery.matches;

  const raf = (time) => {
    if (!lenis) return;
    lenis.raf(time);
    frame = requestAnimationFrame(raf);
  };

  const syncLockedState = () => {
    if (!lenis) return;
    if (document.body.classList.contains('cart-drawer-open')) {
      lenis.stop();
    } else {
      lenis.start();
    }
  };

  const start = async () => {
    if (lenis || !shouldRun()) return;

    try {
      if (!LenisClass) {
        const module = await import('https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.mjs');
        LenisClass = module.default;
      }

      if (!shouldRun()) return;

      lenis = new LenisClass({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      });

      document.documentElement.classList.add('has-lenis');
      frame = requestAnimationFrame(raf);
      syncLockedState();
    } catch (error) {
      lenis = null;
    }
  };

  const stop = () => {
    if (frame) {
      cancelAnimationFrame(frame);
      frame = null;
    }

    if (lenis) {
      lenis.destroy();
      lenis = null;
    }

    document.documentElement.classList.remove('has-lenis');
  };

  const refresh = () => {
    if (shouldRun()) {
      start();
    } else {
      stop();
    }
  };

  const bodyObserver = new MutationObserver(syncLockedState);
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  desktopQuery.addEventListener('change', refresh);
  reduceMotionQuery.addEventListener('change', refresh);
  window.addEventListener('load', () => {
    if (lenis) lenis.resize();
  });

  start();
})();

(() => {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;

  const body = drawer.querySelector('[data-cart-drawer-body]');
  const footer = drawer.querySelector('[data-cart-drawer-footer]');
  const subtotal = drawer.querySelector('[data-cart-subtotal]');
  const currency = drawer.dataset.currency || 'EUR';
  let lastFocus = null;

  const money = (cents) => {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'fr-FR', {
        style: 'currency',
        currency,
      }).format((cents || 0) / 100);
    } catch (error) {
      return `${((cents || 0) / 100).toFixed(2)} ${currency}`;
    }
  };

  const escapeHTML = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

  const cartUrl = window.Shopify && Shopify.routes ? Shopify.routes.root + 'cart' : '/cart';

  const updateHeaderCount = (count) => {
    document.querySelectorAll('.site-header__cart').forEach((link) => {
      link.setAttribute('aria-label', `Panier (${count})`);
      let badge = link.querySelector('.site-header__cart-count');
      if (count > 0 && !badge) {
        badge = document.createElement('span');
        badge.className = 'site-header__cart-count';
        link.appendChild(badge);
      }
      if (badge) {
        if (count > 0) {
          badge.textContent = count;
        } else {
          badge.remove();
        }
      }
    });
  };

  const lineMarkup = (item, index) => {
    const image = item.image
      ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.product_title)}" width="110" height="110" loading="lazy">`
      : '';
    const variant = item.variant_title && item.variant_title !== 'Default Title'
      ? `<span class="cart-drawer-line__variant">${escapeHTML(item.variant_title)}</span>`
      : '';
    const vendor = item.vendor ? `<p>${escapeHTML(item.vendor)}</p>` : '';

    return `
      <article class="cart-drawer-line">
        <a href="${escapeHTML(item.url)}" class="cart-drawer-line__media" tabindex="-1">${image}</a>
        <div class="cart-drawer-line__info">
          ${vendor}
          <a href="${escapeHTML(item.url)}" class="cart-drawer-line__title">${escapeHTML(item.product_title)}</a>
          ${variant}
          <div class="cart-drawer-line__qty">
            <button type="button" data-cart-change data-line="${index + 1}" data-quantity="${Math.max(item.quantity - 1, 0)}" aria-label="Diminuer la quantité">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-change data-line="${index + 1}" data-quantity="${item.quantity + 1}" aria-label="Augmenter la quantité">+</button>
            <button type="button" class="cart-drawer-line__remove" data-cart-change data-line="${index + 1}" data-quantity="0">Retirer</button>
          </div>
        </div>
        <strong class="cart-drawer-line__price">${money(item.final_line_price)}</strong>
      </article>
    `;
  };

  const renderCart = (cart) => {
    updateHeaderCount(cart.item_count);
    if (subtotal) subtotal.textContent = money(cart.total_price);
    if (footer) footer.hidden = cart.item_count === 0;

    if (cart.item_count === 0) {
      body.innerHTML = `
        <div class="cart-drawer__empty">
          <p>Votre panier est vide</p>
          <a href="/collections/all" data-cart-close>Explorer nos produits</a>
        </div>
      `;
      return;
    }

    body.innerHTML = `<div class="cart-drawer__items">${cart.items.map(lineMarkup).join('')}</div>`;
  };

  const fetchCart = () => fetch(`${cartUrl}.js`, {
    headers: { Accept: 'application/json' },
  }).then((response) => response.json());

  const refreshCart = () => fetchCart().then(renderCart);

  const openCart = () => {
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-drawer-open');
    refreshCart();
    const close = drawer.querySelector('[data-cart-close]');
    if (close) close.focus({ preventScroll: true });
  };

  const closeCart = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-drawer-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
  };

  document.addEventListener('click', (event) => {
    const cartToggle = event.target.closest('[data-cart-toggle]');
    if (cartToggle) {
      event.preventDefault();
      openCart();
      return;
    }

    if (event.target.closest('[data-cart-close]')) {
      closeCart();
      return;
    }

    const changeButton = event.target.closest('[data-cart-change]');
    if (changeButton) {
      changeButton.disabled = true;
      fetch(`${cartUrl}/change.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          line: Number(changeButton.dataset.line),
          quantity: Number(changeButton.dataset.quantity),
        }),
      })
        .then((response) => response.json())
        .then(renderCart)
        .catch(() => { window.location.href = cartUrl; });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeCart();
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.action || !form.action.includes('/cart/add')) return;

    event.preventDefault();
    const submitter = event.submitter;
    if (submitter) submitter.disabled = true;

    fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Cart add failed');
        return response.json();
      })
      .then(() => openCart())
      .catch(() => { form.submit(); })
      .finally(() => {
        if (submitter) submitter.disabled = false;
      });
  });
})();
