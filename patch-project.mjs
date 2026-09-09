import fs from "node:fs";
import vm from "node:vm";

const file = "src/storefront.js";
let source = fs.readFileSync(file, "utf8");

function replaceOnce(oldText, newText, label) {
  if (source.includes(newText)) return;

  const first = source.indexOf(oldText);

  if (first === -1 || source.indexOf(oldText, first + 1) !== -1) {
    throw new Error(
  "Automatic storefront patch failed. " +
  "The expected code was missing or appeared more than once. " +
  "Use the original storefront.js supplied with this project version."
);
  }

  source =
    source.slice(0, first) +
    newText +
    source.slice(first + oldText.length);
}

// ۱. نگهداری پایدار سبد و کلید جلوگیری از سفارش تکراری
replaceOnce(
  String.raw`    function saveCart() {
      try {
        localStorage.setItem('vitrin-cart', JSON.stringify(state.cart));
      } catch {}
      updateCartBadge();
    }

    try {
      const saved = JSON.parse(localStorage.getItem('vitrin-cart') || '[]');
      if (Array.isArray(saved)) {
        state.cart = saved.filter(x =>
          x && typeof x.id === 'string' &&
          typeof x.title === 'string' &&
          Number.isFinite(x.price) &&
          Number.isInteger(x.quantity) &&
          x.quantity > 0 && x.quantity <= 99
        ).slice(0, 25);
      }
    } catch {}`,
  String.raw`    function saveCart() {
      try {
        localStorage.setItem('vitrin-cart-v2', JSON.stringify({
          items: state.cart,
          clientKey: state.cartKey
        }));
      } catch {}
      updateCartBadge();
    }

    try {
      const stored = JSON.parse(
        localStorage.getItem('vitrin-cart-v2') || 'null'
      );

      const saved = stored?.items ??
        JSON.parse(localStorage.getItem('vitrin-cart') || '[]');

      if (
        stored &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          stored.clientKey || ''
        )
      ) {
        state.cartKey = stored.clientKey;
      }

      if (Array.isArray(saved)) {
        const seen = new Set();

        state.cart = saved.filter(x => {
          const valid =
            x &&
            typeof x.id === 'string' &&
            x.id.length <= 80 &&
            !seen.has(x.id) &&
            typeof x.title === 'string' &&
            Number.isSafeInteger(x.price) &&
            x.price >= 0 &&
            Number.isInteger(x.quantity) &&
            x.quantity > 0 &&
            x.quantity <= 99;

          if (valid) seen.add(x.id);
          return valid;
        }).slice(0, 25);
      }
    } catch {}`,
  "ذخیره پایدار سبد"
);

// ۲. حفظ کد وضعیت خطای API
replaceOnce(
  String.raw`      if (!response.ok) throw new Error(data.error || 'ارتباط با سرور ناموفق بود.');
      return data;`,
  String.raw`      if (!response.ok) {
        const error = new Error(data.error || 'ارتباط با سرور ناموفق بود.');
        error.status = response.status;
        throw error;
      }
      return data;`,
  "کد وضعیت API"
);

// ۳. قطع شبکه نباید به معنی حذف محصول باشد.
replaceOnce(
  String.raw`              .then(product => ({ item, product }))
              .catch(() => ({ item, product: null }))`,
  String.raw`              .then(product => ({ item, product }))
              .catch(error => {
                if (error.status === 404) {
                  return { item, product: null };
                }
                throw error;
              })`,
  "حفظ سبد هنگام قطع شبکه"
);

// ۴. currentTarget بعد از await قابل اتکا نیست.
replaceOnce(
  String.raw`    $('checkoutForm').addEventListener('submit', async event => {
      event.preventDefault();
      if (state.submitting || !state.cart.length) return;`,
  String.raw`    $('checkoutForm').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (state.submitting || !state.cart.length) return;`,
  "نگهداری مرجع فرم"
);

replaceOnce(
  String.raw`      const fields = new FormData(event.currentTarget);`,
  String.raw`      const fields = new FormData(form);`,
  "خواندن فرم"
);

replaceOnce(
  String.raw`        event.currentTarget.reset();`,
  String.raw`        form.reset();`,
  "بازنشانی فرم"
);

// ۵. بعد از سفارش موفق، خطای دریافت محصولات نباید بی‌صدا بماند.
replaceOnce(
  String.raw`        form.reset();
        loadProducts();`,
  String.raw`        form.reset();
        void loadProducts();`,
  "تازه‌سازی پس از سفارش"
);

// ۶. ظاهر و حرکت‌های تکمیلی؛ بدون کتابخانه سنگین
const extraStyle = String.raw`
    /* VITRIN_MOTION_V2 */
    .hero > div:first-child {
      animation: enter .75s cubic-bezier(.2,.7,.2,1) both;
    }

    .art {
      animation: enter .95s cubic-bezier(.2,.7,.2,1) both;
      animation-delay: .12s;
    }

    .floating-card {
      animation: vitrin-card-float 6s ease-in-out infinite;
    }

    .primary {
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }

    .primary::after {
      content: "";
      position: absolute;
      inset: -80% -45%;
      background: linear-gradient(
        110deg,
        transparent 35%,
        #ffffff24 49%,
        transparent 63%
      );
      transform: translateX(110%);
      pointer-events: none;
      transition: transform .65s ease;
    }

    .primary:hover::after {
      transform: translateX(-110%);
    }

    .icon-btn, .cart-btn, .chip, .add-btn {
      transition:
        transform .2s ease,
        background .2s ease,
        border-color .2s ease;
    }

    .icon-btn:active, .cart-btn:active, .add-btn:active {
      transform: scale(.94);
    }

    .post, .product {
      overflow-wrap: anywhere;
    }

    @keyframes vitrin-card-float {
      50% { transform: translateY(-7px); }
    }

    @media (hover: none) {
      .product:hover {
        transform: none;
      }

      .product:hover .product-image img {
        transform: none;
      }
    }
`;

if (!source.includes("VITRIN_MOTION_V2")) {
  const anchor = "    @media(prefers-reduced-motion: reduce) {";

  if (!source.includes(anchor)) {
    throw new Error(
  "Could not find the reduced-motion CSS section in storefront.js."
);
  }

  // قبل از reduced-motion تا تنظیم دسترس‌پذیری اولویت داشته باشد.
  source = source.replace(anchor, extraStyle + "\n" + anchor);
}

// بررسی نحوی جاوااسکریپت‌های داخل HTML، پیش از نوشتن فایل.
const prefix = "export const storefront = String.raw`";

if (!source.startsWith(prefix)) {
  throw new Error(
  "Invalid storefront.js structure: expected the storefront export."
);
}

const lastBacktick = source.lastIndexOf("`;");
if (lastBacktick === -1) {
  throw new Error(
  "Invalid storefront.js structure: closing template literal was not found."
);
}

const html = source.slice(prefix.length, lastBacktick);

let scriptNumber = 0;

for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
  if (!match[1].trim()) continue;

  scriptNumber++;

  new vm.Script(match[1], {
    filename: `storefront-inline-${scriptNumber}.js`
  });
}

fs.writeFileSync(file, source);

console.log("OK: Cart, checkout, and animation patches applied.");
console.log("OK: Inline browser JavaScript syntax checks passed.");