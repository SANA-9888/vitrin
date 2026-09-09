export const storefront = String.raw`<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#166454">
  <meta name="description" content="فروشگاه آنلاین ویترین">
  <title>ویترین | فروشگاه آنلاین</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <script>
    try {
      document.documentElement.dataset.theme =
        localStorage.getItem('vitrin-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch {}
  </script>

  <style>
    :root {
      --brand: #166454;
      --bg: #f6f5ef;
      --surface: #fff;
      --soft: #eeeee7;
      --text: #202922;
      --muted: #767b74;
      --line: #dfe3db;
      --shadow: 0 24px 80px #2033260b;
      --radius: 28px;
    }

    html[data-theme=dark] {
      --bg: #111714;
      --surface: #1a231d;
      --soft: #242f27;
      --text: #f0f3ec;
      --muted: #a4afa5;
      --line: #354138;
      --shadow: 0 24px 80px #0003;
    }

    * { box-sizing: border-box }
    html { scroll-behavior: smooth; scroll-padding-top: 110px }
    body {
      margin: 0;
      font-family: Vazirmatn, Tahoma, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.8;
      transition: background .25s, color .25s;
    }
    body:has(dialog[open]) { overflow: hidden }
    button, input, textarea, select { font: inherit }
    button, a, input, select, textarea { -webkit-tap-highlight-color: transparent }
    button, a { touch-action: manipulation }
    button { cursor: pointer }
    button:disabled { cursor: not-allowed; opacity: .5 }
    a { color: inherit; text-decoration: none }
    img { max-width: 100%; display: block }
    button { color: inherit }
    :focus-visible { outline: 3px solid var(--brand); outline-offset: 4px }
    ::selection { background: var(--brand); color: white }
    [hidden] { display: none !important }
    .wrap { width: min(1200px, calc(100% - 48px)); margin-inline: auto }
    .muted { color: var(--muted) }
    .small { font-size: .82rem }
    .row { display: flex; align-items: center; gap: 12px }
    .between { justify-content: space-between }
    .stack { display: grid; gap: 14px }
    .skip {
      position: fixed; top: -100px; right: 20px;
      background: var(--surface); padding: 12px; z-index: 99
    }
    .skip:focus { top: 10px }
    .topline {
      text-align: center; padding: 8px 16px; background: var(--brand);
      color: white; font-size: .76rem; letter-spacing: .2px
    }
    header {
      position: sticky; top: 0; z-index: 20;
      background: color-mix(in srgb, var(--bg) 85%, transparent);
      backdrop-filter: blur(22px);
      border-bottom: 1px solid var(--line);
    }
    .nav { min-height: 85px }
    .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px }
    .logo-mark {
      display: grid; place-items: center; width: 42px; height: 42px;
      border-radius: 15px; background: var(--brand); color: white;
      font-size: 1.45rem; transform: rotate(-8deg)
    }
    nav { display: flex; gap: 28px; color: var(--muted); font-size: .9rem }
    nav a:hover { color: var(--text) }
    .icon-btn, .cart-btn {
      border: 1px solid var(--line); background: var(--surface);
      border-radius: 15px; min-width: 44px; min-height: 44px; padding: 8px 13px
    }
    .cart-btn { display: flex; align-items: center; gap: 9px }
    .badge {
      min-width: 22px; height: 22px; padding-inline: 5px; border-radius: 8px;
      display: inline-grid; place-items: center;
      background: var(--brand); color: white; font-size: .7rem
    }
    .hero {
      display: grid; grid-template-columns: 1fr 1fr; gap: 70px;
      align-items: center; padding-block: 80px 65px
    }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 9px;
      border: 1px solid var(--line); background: var(--surface);
      padding: 6px 13px; border-radius: 99px; font-size: .76rem
    }
    .dot { width: 7px; height: 7px; background: var(--brand); border-radius: 50% }
    h1 {
      font-size: clamp(2.35rem, 4.6vw, 4.25rem);
      line-height: 1.45; letter-spacing: -2px; margin: 22px 0;
      max-width: 650px
    }
    .hero p { color: var(--muted); max-width: 500px; font-size: 1rem }
    .primary {
      border: 0; background: var(--brand); color: white;
      border-radius: 16px; padding: 13px 23px; font-weight: 700;
      display: inline-flex; align-items: center; justify-content: center; gap: 12px;
      transition: transform .2s, filter .2s
    }
    .primary:hover { transform: translateY(-2px); filter: brightness(1.08) }
    .ghost {
      border: 1px solid var(--line); background: var(--surface);
      border-radius: 16px; padding: 11px 20px
    }
    .hero-actions { margin-top: 28px; flex-wrap: wrap }
    .hero-note { margin-top: 28px; font-size: .78rem; color: var(--muted) }
    .art {
      position: relative; height: 470px; border-radius: 130px 32px 32px 32px;
      overflow: hidden;
      background:
        radial-gradient(circle at 30% 20%, #ffffff99, transparent 45%),
        linear-gradient(140deg, #e2e7d7, #bccfbe);
      box-shadow: var(--shadow)
    }
    .art::before {
      content: ""; position: absolute; width: 340px; height: 340px;
      border: 1px solid #ffffff90; border-radius: 50%;
      left: -60px; top: -50px
    }
    .art::after {
      content: ""; position: absolute; width: 400px; height: 150px;
      background: #f0efdf; bottom: -35px; left: -25px;
      border-radius: 50%; transform: rotate(-12deg)
    }
    .vase {
      position: absolute; width: 165px; height: 225px; bottom: 63px; left: 29%;
      border-radius: 38% 38% 43% 43%;
      background: repeating-linear-gradient(90deg,#d1b897 0,#f0dfc2 8px,#e5cfad 15px);
      box-shadow: inset -25px 0 35px #876b4533, 25px 30px 35px #324b392a;
      transform: rotate(-7deg); z-index: 2;
      animation: float 7s ease-in-out infinite
    }
    .vase::before {
      content: ""; position: absolute; top: -18px; right: 30px;
      width: 105px; height: 38px; border-radius: 50%;
      background: #7a614c; border: 10px solid #ead5b3
    }
    .stem {
      position: absolute; width: 5px; height: 165px; background: #55774c;
      bottom: 272px; left: 48%; transform: rotate(13deg); z-index: 1
    }
    .leaf {
      position: absolute; width: 75px; height: 36px; background: #55774c;
      border-radius: 0 80% 0 80%; left: 1px; top: 24px; transform: rotate(-20deg)
    }
    .leaf.two { left: -72px; top: 62px; transform: rotate(25deg); background: #759064 }
    .leaf.three { top: -10px; width: 58px; background: #8aa079 }
    .art-label {
      position: absolute; top: 30px; right: 27px; color: #355442;
      font-size: .73rem; letter-spacing: 3px; writing-mode: vertical-rl
    }
    .floating-card {
      position: absolute; bottom: 36px; right: 22px; z-index: 3;
      background: #ffffffe0; backdrop-filter: blur(15px); color: #263b2c;
      border: 1px solid #fff; border-radius: 20px; padding: 14px 20px;
      box-shadow: 0 15px 45px #25492c16
    }
    .floating-card strong { display: block; font-size: .9rem }
    .floating-card span { font-size: .73rem; color: #63715f }
    .art-circle {
      position: absolute; width: 83px; height: 83px; left: 25px; top: 38px;
      border-radius: 50%; background: #ffffff70; display: grid; place-items: center;
      color: #355442; font-size: 2.5rem; animation: rotate 25s linear infinite
    }
    .benefits {
      border-block: 1px solid var(--line); padding: 25px 0;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
      margin-bottom: 70px
    }
    .benefit { display: flex; align-items: center; justify-content: center; gap: 12px }
    .benefit b { font-size: .9rem; display: block }
    .benefit span { font-size: .73rem; color: var(--muted) }
    .benefit-icon {
      width: 45px; height: 45px; border-radius: 15px; background: var(--soft);
      display: grid; place-items: center; font-size: 1.3rem
    }
    .section-head { display: flex; justify-content: space-between; align-items: end; gap: 20px }
    .section-head h2 { font-size: 2rem; letter-spacing: -1px; margin: 0 }
    .section-head p { color: var(--muted); font-size: .85rem; margin-top: 7px }
    .toolbar {
      display: flex; flex-wrap: wrap; gap: 12px; margin: 25px 0 18px
    }
    input, textarea, select {
      border: 1px solid var(--line); background: var(--surface); color: var(--text);
      border-radius: 14px; padding: 12px 15px; min-width: 0
    }
    .search { flex: 1; min-width: 180px }
    .categories {
      display: flex; gap: 9px; overflow-x: auto; padding-bottom: 14px;
      scrollbar-width: thin; margin-bottom: 18px
    }
    .chip {
      border: 1px solid var(--line); padding: 7px 17px; border-radius: 99px;
      background: transparent; white-space: nowrap; font-size: .83rem
    }
    .chip.active { background: var(--text); color: var(--bg); border-color: var(--text) }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px }
    .product {
      background: var(--surface); border: 1px solid var(--line);
      border-radius: var(--radius); overflow: hidden;
      transition: transform .3s, box-shadow .3s;
      animation: enter .5s both
    }
    .product:hover { transform: translateY(-7px); box-shadow: var(--shadow) }
    .product-image {
      position: relative; aspect-ratio: 1.15; overflow: hidden;
      background: var(--soft); display: grid; place-items: center;
      width: 100%; border: 0; padding: 0
    }
    .product-image img {
      width: 100%; height: 100%; object-fit: cover; transition: transform .7s
    }
    .product:hover .product-image img { transform: scale(1.055) }
    .placeholder {
      width: 100%; height: 100%; display: grid; place-items: center;
      background:
        radial-gradient(circle at 30% 25%, #ffffffa0, transparent 60%),
        linear-gradient(145deg, #dce3d3, #c2d0ba);
      color: #44603d; font-size: 4rem
    }
    .product:nth-child(3n+2) .placeholder { background: linear-gradient(135deg,#ece4d7,#d8c5a9) }
    .product:nth-child(3n) .placeholder { background: linear-gradient(135deg,#e1e2ed,#bfc6d6) }
    .stock-label {
      position: absolute; top: 15px; right: 15px;
      border-radius: 99px; padding: 4px 10px;
      background: #ffffffdf; color: #344235; font-size: .68rem
    }
    .product-info { padding: 20px }
    .product-info h3 { margin: 5px 0 18px; font-size: 1rem; font-weight: 700 }
    .product-info h3 button { border: 0; background: none; padding: 0; text-align: right }
    .price { font-weight: 800; font-size: 1.08rem }
    .price small { font-weight: 400; color: var(--muted); font-size: .7rem }
    .add-btn {
      border: 0; border-radius: 13px; width: 42px; height: 42px;
      background: var(--brand); color: white; font-size: 1.45rem
    }
    .empty { padding: 60px 20px; text-align: center; color: var(--muted); grid-column: 1/-1 }
    .skeleton { height: 390px; border-radius: 28px; background: var(--soft); animation: pulse 1.3s infinite }
    .pagination { display: flex; justify-content: center; gap: 14px; align-items: center; margin: 30px 0 75px }
    .editorial {
      margin: 30px 0 75px; padding: 40px; border-radius: 30px;
      background: var(--brand); color: white; display: flex;
      align-items: center; justify-content: space-between; gap: 25px;
      position: relative; overflow: hidden
    }
    .editorial h2 { margin: 0 0 7px; font-size: 1.65rem }
    .editorial p { margin: 0; opacity: .8; font-size: .85rem }
    .editorial .ghost { background: #ffffff18; border-color: #ffffff50; color: white; flex-shrink: 0 }
    .posts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 25px 0 70px }
    .post {
      text-align: right; border: 1px solid var(--line); background: var(--surface);
      border-radius: 23px; padding: 25px; transition: transform .2s
    }
    .post:hover { transform: translateY(-4px) }
    .post h3 { margin: 12px 0; font-size: 1rem }
    .post p { color: var(--muted); font-size: .8rem }
    footer { border-top: 1px solid var(--line); padding: 40px 0 }
    .footer-grid { display: flex; justify-content: space-between; gap: 25px; flex-wrap: wrap }
    .footer-links { display: flex; gap: 18px; flex-wrap: wrap; color: var(--muted); font-size: .85rem }
    .copyright { margin-top: 30px; font-size: .72rem; color: var(--muted) }
    dialog {
      border: 1px solid var(--line); border-radius: 28px; padding: 0;
      width: min(880px, calc(100% - 28px)); max-height: 90dvh;
      background: var(--surface); color: var(--text); box-shadow: 0 35px 120px #0003
    }
    dialog::backdrop { background: #0c181866; backdrop-filter: blur(8px) }
    dialog[open] { animation: enter .25s }
    .dialog-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 24px; border-bottom: 1px solid var(--line);
      position: sticky; top: 0; background: var(--surface); z-index: 2
    }
    .dialog-body { padding: 25px }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 27px }
    .detail-image { aspect-ratio: 1; border-radius: 22px; overflow: hidden }
    .detail-image img { width: 100%; height: 100%; object-fit: cover }
    .detail-title { font-size: 1.5rem; margin: 6px 0 15px }
    .text-content { white-space: pre-wrap; overflow-wrap: anywhere }
    .specs { margin-block: 25px }
    .spec-row { display: flex; gap: 20px; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: .82rem }
    .spec-row span:first-child { color: var(--muted) }
    #cartDialog { width: min(600px, calc(100% - 24px)) }
    .cart-item { display: flex; align-items: center; gap: 13px; padding: 17px 0; border-bottom: 1px solid var(--line) }
    .cart-item-info { flex: 1; min-width: 0 }
    .cart-item-info b { display: block; font-size: .88rem }
    .quantity { display: flex; align-items: center; gap: 10px; direction: ltr }
    .quantity button { background: var(--soft); border: 0; border-radius: 10px; width: 32px; height: 32px }
    .remove { border: 0; background: none; color: var(--muted); font-size: .72rem; padding: 4px 0 }
    .totals { padding: 20px 0; display: grid; gap: 8px; font-size: .88rem }
    .totals .final { font-size: 1.1rem; font-weight: 800; padding-top: 9px }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px }
    label { display: grid; gap: 5px; font-size: .78rem }
    label.full { grid-column: 1/-1 }
    textarea { resize: vertical; min-height: 100px }
    .notice { padding: 12px 15px; border-radius: 13px; background: var(--soft); font-size: .77rem; color: var(--muted) }
    .form-error { color: #c34b3c; font-size: .83rem; min-height: 24px }
    .full-button { width: 100% }
    .success { text-align: center; padding: 30px 10px }
    .success-icon { font-size: 3rem; color: var(--brand) }
    .order-code { font-size: 1.7rem; letter-spacing: 3px; direction: ltr; margin: 20px }
    #toast {
      position: fixed; left: 50%; bottom: 25px; transform: translate(-50%,30px);
      opacity: 0; pointer-events: none; transition: .25s;
      border-radius: 15px; padding: 12px 22px; background: var(--text);
      color: var(--bg); box-shadow: var(--shadow); z-index: 100;
      font-size: .85rem; width: max-content; max-width: calc(100% - 30px)
    }
    #toast.show { transform: translate(-50%,0); opacity: 1 }
    @keyframes float { 50% { transform: translateY(-12px) rotate(-4deg) } }
    @keyframes rotate { to { transform: rotate(360deg) } }
    @keyframes enter { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes pulse { 50% { opacity: .45 } }

    @media(max-width: 900px) {
      .hero { gap: 30px; padding-top: 45px }
      .art { height: 400px }
      nav { gap: 15px }
      .grid { grid-template-columns: repeat(2,1fr) }
      .posts { grid-template-columns: repeat(2,1fr) }
    }

    @media(max-width: 640px) {
      .wrap { width: calc(100% - 30px) }
      .nav { min-height: 73px }
      nav { display: none }
      .logo { font-size: 1.15rem }
      .logo-mark { width: 35px; height: 35px; font-size: 1.2rem }
      .cart-text { display: none }
      .hero { grid-template-columns: 1fr; gap: 30px; padding-block: 35px }
      h1 { font-size: 2.6rem; margin-block: 17px }
      .hero p { font-size: .9rem }
      .art { height: 320px; border-radius: 80px 25px 25px 25px }
      .vase { width: 125px; height: 170px; bottom: 40px; left: 35% }
      .vase::before { width: 83px; height: 30px; right: 21px; top: -14px; border-width: 8px }
      .stem { bottom: 205px; left: 51%; height: 110px }
      .floating-card { bottom: 20px; right: 14px; padding: 10px 15px }
      .benefits { gap: 8px; margin-bottom: 40px; padding-block: 20px }
      .benefit { flex-direction: column; text-align: center; gap: 7px }
      .benefit b { font-size: .75rem }
      .benefit span { font-size: .65rem }
      .benefit-icon { width: 37px; height: 37px }
      .section-head h2 { font-size: 1.55rem }
      .section-head p { font-size: .75rem }
      .grid { gap: 12px }
      .product { border-radius: 20px }
      .product-info { padding: 12px }
      .product-info h3 { font-size: .81rem; min-height: 45px; margin-bottom: 10px }
      .product-info .small { font-size: .65rem }
      .price { font-size: .85rem }
      .price small { display: block; font-size: .6rem }
      .add-btn { width: 34px; height: 34px; border-radius: 11px }
      .stock-label { font-size: .58rem; right: 9px; top: 9px }
      .placeholder { font-size: 3rem }
      .editorial { padding: 27px; align-items: start; flex-direction: column; margin-bottom: 45px }
      .editorial h2 { font-size: 1.4rem }
      .posts { grid-template-columns: 1fr }
      .detail-grid { grid-template-columns: 1fr }
      .detail-image { max-height: 300px }
      .dialog-body { padding: 18px }
      .form-grid { grid-template-columns: 1fr }
      label.full { grid-column: auto }
      .skeleton { height: 290px }
      .quantity { gap: 7px }
      .cart-item-info b { font-size: .78rem }
    }


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

    @media(prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</head>

<body>
  <a href="#products" class="skip">رفتن به محصولات</a>
  <div class="topline">انتخاب با حوصله، خرید با آرامش</div>

  <header>
    <div class="wrap row between nav">
      <a href="/" class="row" aria-label="صفحه اصلی">
        <span class="logo-mark" aria-hidden="true">✳</span>
        <span class="logo" data-store-name>ویترین</span>
      </a>

      <nav aria-label="منوی اصلی">
        <a href="#products">محصولات</a>
        <a href="#journal">مجله</a>
        <a href="#contact">ارتباط با ما</a>
      </nav>

      <div class="row">
        <button id="themeButton" class="icon-btn" aria-label="تغییر حالت روشن و تاریک">◐</button>
        <button id="cartButton" class="cart-btn" aria-label="باز کردن سبد خرید">
          <span aria-hidden="true">♧</span>
          <span class="cart-text">سبد خرید</span>
          <span id="cartCount" class="badge">۰</span>
        </button>
      </div>
    </div>
  </header>

  <main class="wrap">
    <section class="hero">
      <div>
        <div class="eyebrow"><span class="dot"></span>برای سلیقه‌ای که خاص است</div>
        <h1 id="heroTitle">زیبایی، در جزئیات زندگی‌ست.</h1>
        <p id="heroSubtitle">مجموعه‌ای انتخاب‌شده از محصولات خوش‌ساخت برای زندگی روزمره.</p>
        <div class="row hero-actions">
          <a class="primary" href="#products">کشف محصولات <span aria-hidden="true">↙</span></a>
          <a class="ghost" href="#journal">خواندنی‌های ما</a>
        </div>
        <div class="hero-note">طراحی ساده · انتخاب آگاهانه · تجربه‌ای دلنشین</div>
      </div>

      <div class="art" role="img" aria-label="تصویر تزئینی گلدان سرامیکی و برگ‌های سبز">
        <span class="art-label">THE ART OF SIMPLE LIVING</span>
        <span class="art-circle" aria-hidden="true">✳</span>
        <div class="stem"><i class="leaf"></i><i class="leaf two"></i><i class="leaf three"></i></div>
        <div class="vase"></div>
        <div class="floating-card">
          <strong>کمتر، اما بهتر.</strong>
          <span>جزئیاتی برای حال خوب خانه</span>
        </div>
      </div>
    </section>

    <section class="benefits" aria-label="امکانات فروشگاه">
      <div class="benefit">
        <div class="benefit-icon" aria-hidden="true">◇</div>
        <div><b>مشخصات شفاف</b><span>انتخاب با اطلاعات کامل</span></div>
      </div>
      <div class="benefit">
        <div class="benefit-icon" aria-hidden="true">↗</div>
        <div><b>ثبت سفارش آسان</b><span>ساده و بدون پیچیدگی</span></div>
      </div>
      <div class="benefit">
        <div class="benefit-icon" aria-hidden="true">♡</div>
        <div><b>ارتباط مستقیم</b><span>هماهنگی با فروشگاه</span></div>
      </div>
    </section>

    <section id="products">
      <div class="section-head">
        <div>
          <h2>انتخاب‌های دوست‌داشتنی</h2>
          <p>شاید چیز بعدی که دوستش داری، همین‌جا باشد.</p>
        </div>
        <span id="resultCount" class="muted small"></span>
      </div>

      <div class="toolbar">
        <input id="search" class="search" type="search" maxlength="100"
          placeholder="دنبال چه چیزی می‌گردی؟" aria-label="جست‌وجوی محصولات">
        <select id="sort" aria-label="مرتب‌سازی محصولات">
          <option value="newest">جدیدترین‌ها</option>
          <option value="cheap">ارزان‌ترین‌ها</option>
          <option value="expensive">گران‌ترین‌ها</option>
        </select>
      </div>

      <div id="categories" class="categories" aria-label="دسته‌بندی‌ها"></div>
      <div id="productGrid" class="grid" aria-live="polite"></div>

      <div class="pagination">
        <button id="prevPage" class="ghost" disabled>قبلی</button>
        <span id="pageLabel" class="small">۱</span>
        <button id="nextPage" class="ghost" disabled>بعدی</button>
      </div>
    </section>

    <section class="editorial">
      <div>
        <h2>سؤال داری؟ با ما حرف بزن.</h2>
        <p>برای جزئیات محصول و هماهنگی سفارش، مستقیم با فروشگاه در ارتباط باش.</p>
      </div>
      <a class="ghost" href="#contact">راه‌های ارتباطی ↙</a>
    </section>

    <section id="journal">
      <div class="section-head">
        <div><h2>از مجلهٔ ما</h2><p>ایده‌ها، راهنماها و تازه‌های فروشگاه</p></div>
      </div>
      <div id="postGrid" class="posts"></div>
    </section>
  </main>

  <footer id="contact">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <strong class="logo" data-store-name>ویترین</strong>
          <p id="storeDescription" class="muted small">فروشگاه آنلاین شما</p>
        </div>
        <div id="contactLinks" class="footer-links"></div>
      </div>
      <div class="copyright">
        <span id="copyright"></span>
        <span> · ساخته‌شده با ویترین، نرم‌افزار متن‌باز</span>
      </div>
    </div>
  </footer>

  <dialog id="detailDialog" aria-labelledby="detailHeading">
    <div class="dialog-head">
      <strong id="detailHeading">جزئیات محصول</strong>
      <button class="icon-btn" data-close="detailDialog" aria-label="بستن جزئیات">×</button>
    </div>
    <div id="detailBody" class="dialog-body"></div>
  </dialog>

  <dialog id="postDialog" aria-labelledby="postHeading">
    <div class="dialog-head">
      <strong id="postHeading">مجله</strong>
      <button class="icon-btn" data-close="postDialog" aria-label="بستن نوشته">×</button>
    </div>
    <div id="postBody" class="dialog-body"></div>
  </dialog>

  <dialog id="cartDialog" aria-labelledby="cartHeading">
    <div class="dialog-head">
      <strong id="cartHeading">سبد خرید شما</strong>
      <button class="icon-btn" data-close="cartDialog" aria-label="بستن سبد خرید">×</button>
    </div>

    <div class="dialog-body">
      <div id="cartContent"></div>

      <form id="checkoutForm" class="stack" hidden>
        <div class="notice">
          ثبت این فرم به معنی پرداخت نیست. فروشگاه برای تأیید سفارش و هماهنگی پرداخت با شما تماس می‌گیرد.
          اطلاعات تماس و نشانی برای رسیدگی به سفارش در اختیار مدیر فروشگاه و ربات تلگرام او قرار می‌گیرد.
        </div>

        <div class="form-grid">
          <label>
            نام و نام خانوادگی
            <input name="name" autocomplete="name" required minlength="2" maxlength="100" placeholder="مثلاً سارا احمدی">
          </label>
          <label>
            شماره تماس
            <input name="phone" type="tel" autocomplete="tel" required maxlength="20" placeholder="09123456789" dir="ltr">
          </label>
          <label class="full">
            نشانی کامل و کدپستی
            <textarea name="address" autocomplete="street-address" required minlength="10" maxlength="1000"
              placeholder="استان، شهر، خیابان، پلاک، واحد و کدپستی"></textarea>
          </label>
        </div>

        <div id="turnstileBox"></div>
        <div id="checkoutError" class="form-error" role="alert"></div>
        <button id="submitOrder" class="primary full-button" type="submit">ثبت سفارش و دریافت کد پیگیری ↙</button>
      </form>

      <div id="orderSuccess" hidden></div>
    </div>
  </dialog>

  <div id="toast" role="status" aria-live="polite"></div>

  <script>
    'use strict';

    const $ = id => document.getElementById(id);
    const money = n => new Intl.NumberFormat('fa-IR').format(n);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[c]));

    const state = {
      config: {},
      products: new Map(),
      posts: [],
      cart: [],
      page: 1,
      category: '',
      total: 0,
      controller: null,
      cartKey: crypto.randomUUID(),
      turnstileToken: '',
      turnstileWidget: undefined,
      submitting: false,
      toastTimer: null,
      detailSequence: 0
    };

    function saveCart() {
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
    } catch {}

    function updateCartBadge() {
      $('cartCount').textContent = money(
        state.cart.reduce((sum, item) => sum + item.quantity, 0)
      );
    }

    function toast(text) {
      clearTimeout(state.toastTimer);
      $('toast').textContent = text;
      $('toast').classList.add('show');
      state.toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3200);
    }

    async function api(path, options = {}) {
      const response = await fetch(path, options);
      let data;

      try { data = await response.json(); }
      catch { throw new Error('پاسخ سرور قابل خواندن نیست.'); }

      if (!response.ok) {
        const error = new Error(data.error || 'ارتباط با سرور ناموفق بود.');
        error.status = response.status;
        throw error;
      }
      return data;
    }

    function imageMarkup(product) {
      return product.image
        ? '<img src="' + esc(product.image) + '" alt="' + esc(product.title) + '" loading="lazy" decoding="async">'
        : '<div class="placeholder" aria-hidden="true">✳</div>';
    }

    function renderProducts(products) {
      if (!products.length) {
        $('productGrid').innerHTML = '<div class="empty">محصولی پیدا نشد. عبارت یا دسته‌بندی دیگری را امتحان کن.</div>';
        return;
      }

      $('productGrid').innerHTML = products.map((p, i) => {
        state.products.set(p.id, p);
        return '<article class="product" style="animation-delay:' + (i * 35) + 'ms">' +
          '<button class="product-image" data-detail="' + esc(p.id) + '" aria-label="مشاهده ' + esc(p.title) + '">' +
            imageMarkup(p) +
            '<span class="stock-label">' + (p.stock ? 'آماده سفارش' : 'ناموجود') + '</span>' +
          '</button>' +
          '<div class="product-info">' +
            '<span class="muted small">' + esc(p.category) + '</span>' +
            '<h3><button data-detail="' + esc(p.id) + '">' + esc(p.title) + '</button></h3>' +
            '<div class="row between">' +
              '<div class="price">' + money(p.price) + ' <small>تومان</small></div>' +
              '<button class="add-btn" data-add="' + esc(p.id) + '" aria-label="افزودن ' + esc(p.title) + ' به سبد"' +
                (p.stock ? '' : ' disabled') + '>+</button>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    async function loadProducts() {
      state.controller?.abort();
      state.controller = new AbortController();
      const signal = state.controller.signal;

      $('productGrid').innerHTML = Array(6).fill('<div class="skeleton" aria-hidden="true"></div>').join('');
      $('productGrid').setAttribute('aria-busy', 'true');
      $('prevPage').disabled = true;
      $('nextPage').disabled = true;

      try {
        const params = new URLSearchParams({
          q: $('search').value.trim(),
          category: state.category,
          page: String(state.page),
          sort: $('sort').value
        });

        const data = await api('/api/products?' + params, { signal });
        if (signal.aborted) return;

        state.total = data.total;
        renderProducts(data.products);
        $('resultCount').textContent = money(data.total) + ' محصول';
        $('pageLabel').textContent = money(state.page);
        $('prevPage').disabled = state.page <= 1;
        $('nextPage').disabled = state.page * 12 >= data.total;

        $('categories').innerHTML = [''].concat(data.categories).map(category =>
          '<button class="chip ' + (state.category === category ? 'active' : '') +
          '" data-category="' + esc(category) + '" aria-pressed="' + (state.category === category) + '">' +
          esc(category || 'همه محصولات') + '</button>'
        ).join('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          $('productGrid').innerHTML =
            '<div class="empty">' + esc(error.message) +
            '<br><button class="ghost" id="retryProducts">تلاش دوباره</button></div>';
        }
      } finally {
        if (!signal.aborted) $('productGrid').setAttribute('aria-busy', 'false');
      }
    }

    function addToCart(productId) {
      if (state.submitting) return;

      const p = state.products.get(productId);
      if (!p || !p.stock) return toast('این محصول موجود نیست.');

      const existing = state.cart.find(x => x.id === productId);

      if (existing) {
        if (existing.quantity >= Math.min(p.stock, 99)) {
          return toast('بیش از موجودی محصول نمی‌توان اضافه کرد.');
        }

        existing.quantity++;
        existing.price = p.price;
        existing.title = p.title;
      } else {
        if (state.cart.length >= 25) {
          return toast('حداکثر ۲۵ نوع محصول در هر سفارش مجاز است.');
        }

        state.cart.push({
          id: p.id,
          title: p.title,
          price: p.price,
          quantity: 1
        });
      }

      state.cartKey = crypto.randomUUID();
      saveCart();
      toast('به سبد خرید اضافه شد ♡');
    }

    async function openDetail(productId) {
      const sequence = ++state.detailSequence;
      $('detailBody').innerHTML = '<div class="empty">در حال دریافت اطلاعات...</div>';

      if (!$('detailDialog').open) $('detailDialog').showModal();

      try {
        const p = await api('/api/product/' + encodeURIComponent(productId));
        if (sequence !== state.detailSequence) return;

        state.products.set(p.id, p);

        $('detailBody').innerHTML =
          '<div class="detail-grid">' +
            '<div class="detail-image">' + imageMarkup(p) + '</div>' +
            '<div>' +
              '<span class="muted small">' + esc(p.category) + '</span>' +
              '<h2 class="detail-title">' + esc(p.title) + '</h2>' +
              '<div class="text-content muted small">' + esc(p.description) + '</div>' +
              '<div class="specs">' +
                Object.entries(p.specs || {}).map(([key, val]) =>
                  '<div class="spec-row"><span>' + esc(key) + '</span><span>' + esc(val) + '</span></div>'
                ).join('') +
              '</div>' +
              '<div class="row between">' +
                '<span class="price">' + money(p.price) + ' <small>تومان</small></span>' +
                '<button class="primary" data-add="' + esc(p.id) + '"' + (p.stock ? '' : ' disabled') + '>' +
                  (p.stock ? 'افزودن به سبد +' : 'ناموجود') +
                '</button>' +
              '</div>' +
              '<p class="small muted">موجودی: ' + money(p.stock) + ' عدد</p>' +
            '</div>' +
          '</div>';
      } catch (error) {
        if (sequence === state.detailSequence) {
          $('detailBody').innerHTML = '<div class="empty">' + esc(error.message) + '</div>';
        }
      }
    }

    function renderCart() {
      $('orderSuccess').hidden = true;
      $('cartContent').hidden = false;
      $('checkoutError').textContent = '';

      if (!state.cart.length) {
        $('cartContent').innerHTML = '<div class="empty">سبد خریدت هنوز خالی است.<br>یک انتخاب دوست‌داشتنی منتظر توست ♡</div>';
        $('checkoutForm').hidden = true;
        return;
      }

      const subtotal = state.cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
      const shipping = Number(state.config.shipping_fee || 0);

      $('cartContent').innerHTML = state.cart.map(x =>
        '<div class="cart-item">' +
          '<div class="cart-item-info">' +
            '<b>' + esc(x.title) + '</b>' +
            '<span class="small muted">' + money(x.price * x.quantity) + ' تومان</span><br>' +
            '<button class="remove" data-remove="' + esc(x.id) + '">حذف از سبد</button>' +
          '</div>' +
          '<div class="quantity">' +
            '<button data-quantity="' + esc(x.id) + '" data-delta="-1" aria-label="کاهش تعداد">−</button>' +
            '<span>' + money(x.quantity) + '</span>' +
            '<button data-quantity="' + esc(x.id) + '" data-delta="1" aria-label="افزایش تعداد">+</button>' +
          '</div>' +
        '</div>'
      ).join('') +
        '<div class="totals">' +
          '<div class="row between"><span class="muted">مجموع محصولات</span><span>' + money(subtotal) + ' تومان</span></div>' +
          '<div class="row between"><span class="muted">هزینه ارسال</span><span>' + (shipping ? money(shipping) + ' تومان' : 'رایگان') + '</span></div>' +
          '<div class="row between final"><span>مجموع سفارش</span><span>' + money(subtotal + shipping) + ' تومان</span></div>' +
        '</div>';

      $('checkoutForm').hidden = false;
      ensureTurnstile();
    }

    async function openCart() {
      if ($('detailDialog').open) $('detailDialog').close();
      if ($('postDialog').open) $('postDialog').close();
      if (!$('cartDialog').open) $('cartDialog').showModal();

      if (state.submitting) return;

      $('checkoutForm').hidden = true;
      $('orderSuccess').hidden = true;
      $('cartContent').hidden = false;
      $('cartContent').innerHTML = '<div class="empty">بررسی قیمت و موجودی...</div>';

      try {
        state.config = await api('/api/config');

        const products = await Promise.all(
          state.cart.map(item =>
            api('/api/product/' + encodeURIComponent(item.id))
              .then(product => ({ item, product }))
              .catch(error => {
                if (error.status === 404) {
                  return { item, product: null };
                }
                throw error;
              })
          )
        );

        let changed = false;
        const next = [];

        for (const { item, product } of products) {
          if (!product || !product.stock) {
            changed = true;
            continue;
          }

          state.products.set(product.id, product);
          const quantity = Math.min(item.quantity, product.stock, 99);

          if (quantity !== item.quantity || item.price !== product.price) changed = true;

          next.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity
          });
        }

        state.cart = next;

        if (changed) {
          state.cartKey = crypto.randomUUID();
          toast('سبد با قیمت و موجودی فعلی به‌روزرسانی شد.');
        }

        saveCart();
        renderCart();
      } catch (error) {
        $('cartContent').innerHTML = '<div class="empty">' + esc(error.message) + '</div>';
      }
    }

    let turnstileLoading = false;

    function ensureTurnstile() {
      const key = state.config.turnstile_site_key;
      if (!key) return;

      if (!window.turnstile) {
        if (!turnstileLoading) {
          turnstileLoading = true;
          const script = document.createElement('script');
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          script.async = true;
          script.onload = ensureTurnstile;
          script.onerror = () => {
            turnstileLoading = false;
            $('checkoutError').textContent = 'ابزار ضدربات بارگذاری نشد؛ اتصال اینترنت را بررسی کنید.';
          };
          document.head.appendChild(script);
        }
        return;
      }

      if (state.turnstileWidget === undefined) {
        state.turnstileWidget = window.turnstile.render('#turnstileBox', {
          sitekey: key,
          theme: 'auto',
          callback: token => { state.turnstileToken = token; },
          'expired-callback': () => { state.turnstileToken = ''; },
          'error-callback': () => { state.turnstileToken = ''; }
        });
      }
    }

    function resetTurnstile() {
      state.turnstileToken = '';
      if (window.turnstile && state.turnstileWidget !== undefined) {
        window.turnstile.reset(state.turnstileWidget);
      }
    }

    $('checkoutForm').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (state.submitting || !state.cart.length) return;

      if (state.config.turnstile_site_key && !state.turnstileToken) {
        $('checkoutError').textContent = 'ابتدا بررسی ضدربات را کامل کنید.';
        ensureTurnstile();
        return;
      }

      state.submitting = true;
      $('submitOrder').disabled = true;
      $('submitOrder').textContent = 'در حال ثبت سفارش...';
      $('checkoutError').textContent = '';

      const fields = new FormData(form);

      try {
        const data = await api('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientKey: state.cartKey,
            name: fields.get('name'),
            phone: fields.get('phone'),
            address: fields.get('address'),
            items: state.cart.map(x => ({ id: x.id, quantity: x.quantity })),
            turnstileToken: state.turnstileToken
          })
        });

        state.cart = [];
        state.cartKey = crypto.randomUUID();
        saveCart();

        $('checkoutForm').hidden = true;
        $('cartContent').hidden = true;
        $('orderSuccess').hidden = false;
        $('orderSuccess').innerHTML =
          '<div class="success">' +
            '<div class="success-icon">✓</div>' +
            '<h2>سفارش شما ثبت شد</h2>' +
            '<p class="muted">کد سفارش را برای پیگیری نگه دارید.</p>' +
            '<div class="order-code">' + esc(data.orderId) + '</div>' +
            '<p class="small muted">فروشگاه برای تأیید و هماهنگی پرداخت با شما تماس می‌گیرد.<br>هنوز پرداختی انجام نشده است.</p>' +
            '<button class="primary" data-close="cartDialog">بازگشت به فروشگاه</button>' +
          '</div>';

        form.reset();
        void loadProducts();
      } catch (error) {
        $('checkoutError').textContent = error.message;
      } finally {
        state.submitting = false;
        $('submitOrder').disabled = false;
        $('submitOrder').textContent = 'ثبت سفارش و دریافت کد پیگیری ↙';
        resetTurnstile();
      }
    });

    async function loadPosts() {
      try {
        state.posts = await api('/api/posts');

        $('postGrid').innerHTML = state.posts.length
          ? state.posts.map(post =>
              '<button class="post" data-post="' + esc(post.id) + '">' +
                '<span class="small muted">' +
                  new Date(post.created_at * 1000).toLocaleDateString('fa-IR') +
                '</span>' +
                '<h3>' + esc(post.title) + '</h3>' +
                '<p>' + esc(post.body.slice(0, 140)) + (post.body.length > 140 ? '…' : '') + '</p>' +
                '<span class="small">خواندن نوشته ↙</span>' +
              '</button>'
            ).join('')
          : '<div class="empty">به‌زودی، داستان‌ها و راهنماهای تازه اینجا منتشر می‌شوند.</div>';
      } catch {
        $('postGrid').innerHTML = '<div class="empty">دریافت نوشته‌ها فعلاً ممکن نیست.</div>';
      }
    }

    function safeLink(url) {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' ? parsed.href : '';
      } catch { return ''; }
    }

    async function loadConfig() {
      state.config = await api('/api/config');
      const c = state.config;

      document.querySelectorAll('[data-store-name]').forEach(el => {
        el.textContent = c.store_name || 'ویترین';
      });

      $('heroTitle').textContent = c.hero_title || '';
      $('heroSubtitle').textContent = c.hero_subtitle || '';
      $('storeDescription').textContent = c.store_description || '';
      document.title = (c.store_name || 'ویترین') + ' | فروشگاه آنلاین';
      document.querySelector('meta[name=description]').content = c.store_description || '';

      if (/^#[0-9a-f]{6}$/i.test(c.brand_color)) {
        document.documentElement.style.setProperty('--brand', c.brand_color);
        document.querySelector('meta[name=theme-color]').content = c.brand_color;
      }

      const links = [];

      const phone = String(c.contact_phone || '').replace(/[^\d+]/g, '');
      if (phone) links.push('<a href="tel:' + esc(phone) + '">تماس: ' + esc(c.contact_phone) + '</a>');

      if (/^[a-z0-9_]{5,32}$/i.test(c.contact_telegram || '')) {
        links.push('<a href="https://t.me/' + esc(c.contact_telegram) + '" target="_blank" rel="noopener noreferrer">پشتیبانی تلگرام ↗</a>');
      }

      const instagram = safeLink(c.instagram_url);
      if (instagram) links.push('<a href="' + esc(instagram) + '" target="_blank" rel="noopener noreferrer">اینستاگرام ↗</a>');

      $('contactLinks').innerHTML = links.join('');
      $('copyright').textContent =
        '© ' + new Date().toLocaleDateString('fa-IR', { year: 'numeric' }) + ' ' + (c.store_name || 'ویترین');
    }

    let searchTimer;

    $('search').addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.page = 1;
        loadProducts();
      }, 300);
    });

    $('sort').addEventListener('change', () => {
      state.page = 1;
      loadProducts();
    });

    $('prevPage').addEventListener('click', () => {
      if (state.page > 1) {
        state.page--;
        loadProducts();
        $('products').scrollIntoView();
      }
    });

    $('nextPage').addEventListener('click', () => {
      if (state.page * 12 < state.total) {
        state.page++;
        loadProducts();
        $('products').scrollIntoView();
      }
    });

    $('themeButton').addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('vitrin-theme', next); } catch {}
    });

    $('cartButton').addEventListener('click', openCart);

    document.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;

      if (button.dataset.close) {
        $(button.dataset.close).close();
        return;
      }

      if (button.id === 'retryProducts') return loadProducts();
      if (button.dataset.detail) return openDetail(button.dataset.detail);
      if (button.dataset.add) return addToCart(button.dataset.add);

      if (button.hasAttribute('data-category')) {
        state.category = button.dataset.category;
        state.page = 1;
        return loadProducts();
      }

      if (button.dataset.post) {
        const post = state.posts.find(x => x.id === button.dataset.post);
        if (!post) return;

        $('postHeading').textContent = post.title;
        $('postBody').innerHTML = '<div class="text-content">' + esc(post.body) + '</div>';
        $('postDialog').showModal();
        return;
      }

      if (state.submitting) return;

      if (button.dataset.remove) {
        state.cart = state.cart.filter(x => x.id !== button.dataset.remove);
        state.cartKey = crypto.randomUUID();
        saveCart();
        renderCart();
      }

      if (button.dataset.quantity) {
        const item = state.cart.find(x => x.id === button.dataset.quantity);
        if (!item) return;

        const next = item.quantity + Number(button.dataset.delta);
        const product = state.products.get(item.id);
        const limit = Math.min(product?.stock ?? 99, 99);

        if (next > limit) return toast('بیش از موجودی محصول نمی‌توان اضافه کرد.');

        if (next <= 0) state.cart = state.cart.filter(x => x.id !== item.id);
        else item.quantity = next;

        state.cartKey = crypto.randomUUID();
        saveCart();
        renderCart();
      }
    });

    updateCartBadge();

    Promise.all([
      loadConfig().catch(error => toast(error.message)),
      loadProducts(),
      loadPosts()
    ]);
  </script>
</body>
</html>`;