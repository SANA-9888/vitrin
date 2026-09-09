import { storefront } from "./storefront.js";

const MAX_PRICE = 1_000_000_000_000;
const MAX_STOCK = 1_000_000;
const MONEY = new Intl.NumberFormat("fa-IR");

const SETTING_LABELS = {
  store_name: "نام فروشگاه",
  store_description: "توضیح کوتاه",
  hero_title: "عنوان اصلی صفحه",
  hero_subtitle: "متن معرفی",
  brand_color: "رنگ برند",
  contact_phone: "تلفن تماس",
  contact_telegram: "نام کاربری پشتیبانی تلگرام",
  instagram_url: "لینک اینستاگرام",
  shipping_fee: "هزینه ارسال"
};

const PRODUCT_LABELS = {
  title: "نام محصول",
  description: "توضیحات",
  category: "دسته‌بندی",
  price: "قیمت",
  stock: "موجودی",
  specs: "مشخصات",
  photo: "تصویر"
};

const STATUS_LABELS = {
  new: "جدید",
  confirmed: "تأییدشده",
  sent: "ارسال‌شده",
  cancelled: "لغوشده"
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function id() {
  return crypto.randomUUID();
}

function normalDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, c => "۰۱۲۳۴۵۶۷۸۹".indexOf(c))
    .replace(/[٠-٩]/g, c => "٠١٢٣٤٥٦٧٨٩".indexOf(c));
}

function numberValue(text, max = MAX_PRICE) {
  const clean = normalDigits(text).replace(/[,٬\s]/g, "");

  if (!/^\d+$/.test(clean)) throw new Error("فقط عدد صحیح و غیرمنفی وارد کن.");

  const n = Number(clean);

  if (!Number.isSafeInteger(n) || n > max) {
    throw new Error("عدد واردشده بیش از محدوده مجاز است.");
  }

  return n;
}

function cleanText(value, min, max, label) {
  if (typeof value !== "string") {
    throw new HttpError(400, `${label} معتبر نیست.`);
  }

  const text = value.trim();

  if (text.length < min || text.length > max) {
    throw new HttpError(400, `${label} باید بین ${min} و ${max} کاراکتر باشد.`);
  }

  return text;
}

async function readJson(request, limit = 16384) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new HttpError(415, "نوع درخواست معتبر نیست.");
  }

  if (!request.body) throw new HttpError(400, "بدنه درخواست خالی است.");

  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    length += value.byteLength;

    if (length > limit) {
      await reader.cancel();
      throw new HttpError(413, "حجم درخواست بیش از حد مجاز است.");
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(length);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new HttpError(400, "درخواست JSON معتبر نیست.");
  }
}

async function settings(env) {
  const defaults = JSON.parse(env.DEFAULTS_JSON || "{}");
  const { results } = await env.DB.prepare(
    "SELECT key, value FROM settings"
  ).all();

  for (const row of results) defaults[row.key] = row.value;

  defaults.shipping_fee = Number(defaults.shipping_fee || 0);
  return defaults;
}

function publicProduct(row) {
  let specs = {};

  try {
    specs = JSON.parse(row.specs || "{}");
  } catch {}

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    price: row.price,
    stock: row.stock,
    specs,
    image: row.photo
      ? `/media/${encodeURIComponent(row.id)}?v=${row.updated_at}`
      : null
  };
}

async function tg(env, method, data) {
  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );

  const body = await response.json();

  if (!body.ok) {
    // توکن یا URL حاوی توکن را وارد خطا نمی‌کنیم.
    throw new Error("ارتباط با تلگرام ناموفق بود.");
  }

  return body.result;
}

function button(text, callback_data) {
  return { text, callback_data };
}

function send(env, chat, text, rows = []) {
  return tg(env, "sendMessage", {
    chat_id: chat,
    text: String(text).slice(0, 3900),
    ...(rows.length ? {
      reply_markup: { inline_keyboard: rows }
    } : {})
  });
}

function adminIds(env) {
  return (env.TELEGRAM_ADMIN_IDS || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);
}

async function home(env, chat) {
  await env.DB.prepare("DELETE FROM sessions WHERE admin_id = ?")
    .bind(String(chat)).run();

  return send(env, chat,
    "✨ به مدیریت ویترین خوش آمدی.\n\nچه بخشی را می‌خواهی مدیریت کنی؟",
    [
      [button("📦 محصولات", "products:0"), button("➕ محصول جدید", "newproduct")],
      [button("📝 وبلاگ", "posts:0"), button("✍️ نوشته جدید", "newpost")],
      [button("🧾 سفارش‌ها", "orders:0")],
      [button("🎨 تنظیمات فروشگاه", "settings")],
      [button("📊 آمار", "stats")]
    ]
  );
}

async function productMenu(env, chat, productId) {
  const p = await env.DB.prepare("SELECT * FROM products WHERE id = ?")
    .bind(productId).first();

  if (!p) return send(env, chat, "محصول پیدا نشد.");

  const fields = Object.entries(PRODUCT_LABELS)
    .map(([key, label]) => button(label, `pe:${p.id}:${key}`));

  const rows = [];

  for (let i = 0; i < fields.length; i += 2) {
    rows.push(fields.slice(i, i + 2));
  }

  rows.push([
    button(p.active ? "🙈 پنهان‌کردن" : "✅ انتشار", `pt:${p.id}`),
    button("🗑 حذف", `pd:${p.id}`)
  ]);
  rows.push([button("↩️ محصولات", "products:0")]);

  return send(env, chat,
    `📦 ${p.title}\n\n` +
    `قیمت: ${MONEY.format(p.price)} تومان\n` +
    `موجودی: ${MONEY.format(p.stock)}\n` +
    `دسته: ${p.category}\n` +
    `وضعیت: ${p.active ? "منتشرشده" : "پیش‌نویس"}\n` +
    `تصویر: ${p.photo ? "دارد" : "ندارد"}\n\n` +
    "برای تغییر هر بخش، دکمه‌اش را بزن.",
    rows
  );
}

async function postMenu(env, chat, postId) {
  const p = await env.DB.prepare("SELECT * FROM posts WHERE id = ?")
    .bind(postId).first();

  if (!p) return send(env, chat, "نوشته پیدا نشد.");

  return send(env, chat,
    `📝 ${p.title}\nوضعیت: ${p.active ? "منتشرشده" : "پیش‌نویس"}`,
    [
      [button("عنوان", `be:${p.id}:title`), button("متن", `be:${p.id}:body`)],
      [button(p.active ? "پنهان‌کردن" : "انتشار", `bt:${p.id}`)],
      [button("🗑 حذف", `bd:${p.id}`), button("↩️ وبلاگ", "posts:0")]
    ]
  );
}

async function listMenu(env, chat, kind, page = 0) {
  page = Math.max(0, Math.min(100000, Number(page) || 0));

  const table = {
    products: "products",
    posts: "posts",
    orders: "orders"
  }[kind];

  if (!table) return;

  const { results } = await env.DB.prepare(
    `SELECT * FROM ${table} ORDER BY created_at DESC, id DESC LIMIT 9 OFFSET ?`
  ).bind(page * 8).all();

  const rows = results.slice(0, 8).map(item => [
    button(
      kind === "orders"
        ? `${STATUS_LABELS[item.status]} · ${item.customer_name} · ${item.id}`
        : `${item.active ? "🟢" : "⚪"} ${item.title}`.slice(0, 55),
      `${kind === "products" ? "p" : kind === "posts" ? "b" : "o"}:${item.id}`
    )
  ]);

  const nav = [];

  if (page > 0) nav.push(button("قبلی", `${kind}:${page - 1}`));
  if (results.length > 8) nav.push(button("بعدی", `${kind}:${page + 1}`));
  if (nav.length) rows.push(nav);

  rows.push([button("🏠 منوی اصلی", "home")]);

  return send(env, chat,
    results.length ? "یکی از موارد را انتخاب کن:" : "هنوز موردی ثبت نشده است.",
    rows
  );
}

async function setSession(env, chat, payload) {
  await env.DB.prepare(`
    INSERT INTO sessions(admin_id, payload, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(admin_id) DO UPDATE SET
      payload = excluded.payload,
      updated_at = unixepoch()
  `).bind(String(chat), JSON.stringify(payload)).run();
}

async function settingMenu(env, chat) {
  const s = await settings(env);

  return send(env, chat,
    "🎨 تنظیمات فروشگاه\n\n" +
    Object.entries(SETTING_LABELS)
      .map(([key, label]) => `${label}: ${s[key] || "تنظیم نشده"}`)
      .join("\n"),
    [
      ...Object.entries(SETTING_LABELS)
        .map(([key, label]) => [button(label, `se:${key}`)]),
      [button("🏠 منوی اصلی", "home")]
    ]
  );
}

async function orderMessage(env, chat, orderId) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(orderId).first();

  if (!order) return send(env, chat, "سفارش پیدا نشد.");

  const { results: items } = await env.DB.prepare(
    "SELECT * FROM order_items WHERE order_id = ?"
  ).bind(orderId).all();

  const rows = [];

  if (order.status === "new") {
    rows.push([
      button("✅ تأیید سفارش", `os:${order.id}:confirmed`),
      button("❌ لغو سفارش", `oc:${order.id}`)
    ]);
  }

  if (order.status === "confirmed") {
    rows.push([
      button("🚚 ارسال شد", `os:${order.id}:sent`),
      button("❌ لغو سفارش", `oc:${order.id}`)
    ]);
  }

  rows.push([button("↩️ سفارش‌ها", "orders:0")]);

  return send(env, chat,
    `🧾 سفارش ${order.id}\n` +
    `وضعیت: ${STATUS_LABELS[order.status]}\n\n` +
    `نام: ${order.customer_name}\n` +
    `تلفن: ${order.phone}\n` +
    `نشانی: ${order.address}\n\n` +
    items.map(i =>
      `• ${i.title} × ${MONEY.format(i.quantity)} — ` +
      `${MONEY.format(i.unit_price * i.quantity)} تومان`
    ).join("\n") +
    `\n\nارسال: ${MONEY.format(order.shipping)} تومان` +
    `\nمجموع: ${MONEY.format(order.total)} تومان` +
    "\n\nاین سفارش پرداخت آنلاین نشده است.",
    rows
  );
}

async function notifyOrder(env, orderId) {
  const order = await env.DB.prepare(
    "SELECT notified FROM orders WHERE id = ?"
  ).bind(orderId).first();

  if (!order || order.notified) return;

  const ids = adminIds(env);
  if (!ids.length) return;

  const results = await Promise.allSettled(
    ids.map(chat => orderMessage(env, chat, orderId))
  );

  if (results.every(result => result.status === "fulfilled")) {
    await env.DB.prepare("UPDATE orders SET notified = 1 WHERE id = ?")
      .bind(orderId).run();
  }
}

async function receiveSession(env, chat, message, session) {
  const text = (message.text || "").trim();

  if (session.kind === "product") {
    const field = session.field;

    if (!Object.hasOwn(PRODUCT_LABELS, field)) {
      throw new Error("فیلد معتبر نیست.");
    }

    let value;

    if (field === "photo") {
      if (text === "-") {
        value = null;
      } else {
        const photo = message.photo?.at(-1);

        if (!photo) {
          throw new Error("عکس را به‌صورت Photo بفرست، نه فایل. برای حذف تصویر، - بفرست.");
        }

        if (!photo.file_size || photo.file_size > 4 * 1024 * 1024) {
          throw new Error("حجم تصویر باید حداکثر ۴ مگابایت باشد.");
        }

        value = photo.file_id;
      }
    } else if (field === "price") {
      value = numberValue(text);
    } else if (field === "stock") {
      value = numberValue(text, MAX_STOCK);
    } else if (field === "specs") {
      const specs = Object.create(null);

      if (text !== "-") {
        const lines = text.split("\n").filter(x => x.trim());

        if (!lines.length || lines.length > 30) {
          throw new Error("بین ۱ تا ۳۰ ویژگی وارد کن.");
        }

        for (const line of lines) {
          const at = line.search(/[:：]/);

          if (at < 1) {
            throw new Error("فرمت هر خط باید «عنوان: مقدار» باشد.");
          }

          const key = line.slice(0, at).trim();
          const val = line.slice(at + 1).trim();

          if (!key || key.length > 60 || !val || val.length > 200) {
            throw new Error("عنوان ویژگی حداکثر ۶۰ و مقدار آن حداکثر ۲۰۰ کاراکتر باشد.");
          }

          specs[key] = val;
        }
      }

      value = JSON.stringify(specs);
    } else {
      const limits = {
        title: [1, 120],
        category: [1, 60],
        description: [0, 3000]
      };

      const [min, max] = limits[field];
      value = cleanText(text === "-" && min === 0 ? "" : text, min, max, "متن");
    }

    const changed = await env.DB.prepare(
      `UPDATE products SET ${field} = ?, updated_at = unixepoch() WHERE id = ?`
    ).bind(value, session.id).run();

    if (!changed.meta.changes) throw new Error("محصول دیگر وجود ندارد.");

    await env.DB.prepare("DELETE FROM sessions WHERE admin_id = ?")
      .bind(String(chat)).run();

    await send(env, chat, "✅ تغییر ذخیره شد.");
    return productMenu(env, chat, session.id);
  }

  if (session.kind === "post") {
    if (!["title", "body"].includes(session.field)) {
      throw new Error("فیلد نامعتبر است.");
    }

    const value = cleanText(text, 1, session.field === "title" ? 140 : 3500, "متن");

    await env.DB.prepare(
      `UPDATE posts SET ${session.field} = ? WHERE id = ?`
    ).bind(value, session.id).run();

    await env.DB.prepare("DELETE FROM sessions WHERE admin_id = ?")
      .bind(String(chat)).run();

    return postMenu(env, chat, session.id);
  }

  if (session.kind === "setting") {
    const key = session.key;

    if (!Object.hasOwn(SETTING_LABELS, key)) {
      throw new Error("تنظیم معتبر نیست.");
    }

    let value = text === "-" ? "" : text;

    if (key === "shipping_fee") {
      value = String(numberValue(text, 1000000000));
    } else if (key === "brand_color") {
      if (!/^#[0-9a-f]{6}$/i.test(value)) {
        throw new Error("رنگ را شبیه #166454 بفرست.");
      }
    } else if (key === "contact_telegram") {
      value = value.replace(/^@/, "");

      if (value && !/^[a-z0-9_]{5,32}$/i.test(value)) {
        throw new Error("نام کاربری تلگرام معتبر نیست.");
      }
    } else if (key === "instagram_url") {
      if (value) {
        let url;
        try { url = new URL(value); } catch {}

        if (!url || url.protocol !== "https:") {
          throw new Error("یک لینک کامل HTTPS بفرست.");
        }
      }
    } else {
      const min = ["store_name", "hero_title"].includes(key) ? 1 : 0;
      value = cleanText(value, min, key === "hero_subtitle" ? 500 : 180, "مقدار");
    }

    await env.DB.prepare(`
      INSERT INTO settings(key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).bind(key, value).run();

    await env.DB.prepare("DELETE FROM sessions WHERE admin_id = ?")
      .bind(String(chat)).run();

    await send(env, chat, "✅ تنظیمات ذخیره شد؛ صفحه سایت را تازه‌سازی کن.");
    return settingMenu(env, chat);
  }
}

async function callback(env, chat, data) {
  const [action, itemId, field] = data.split(":");

  if (action === "home") return home(env, chat);

  if (["products", "posts", "orders"].includes(action)) {
    return listMenu(env, chat, action, itemId);
  }

  if (action === "newproduct") {
    const productId = id();

    await env.DB.prepare("INSERT INTO products(id) VALUES (?)")
      .bind(productId).run();

    await send(env, chat, "محصول به‌صورت پیش‌نویس ساخته شد. نام، قیمت، موجودی و بقیه بخش‌ها را تنظیم کن.");
    return productMenu(env, chat, productId);
  }

  if (action === "p") return productMenu(env, chat, itemId);

  if (action === "pe" && Object.hasOwn(PRODUCT_LABELS, field)) {
    await setSession(env, chat, { kind: "product", id: itemId, field });

    const hints = {
      specs: "ویژگی‌ها را هرکدام در یک خط بفرست:\n\nجنس: چوب\nرنگ: گردویی\nابعاد: ۳۰ × ۴۰ سانتی‌متر\n\nاین فهرست جایگزین قبلی می‌شود؛ برای کم‌کردن یک ویژگی، خط آن را حذف کن.\nبرای پاک‌کردن همه ویژگی‌ها: -",
      photo: "عکس محصول را به‌صورت Photo بفرست.\nتلگرام آن را فشرده می‌کند.\nحداکثر ۴ مگابایت.\nبرای حذف عکس: -",
      price: "قیمت را به تومان بفرست؛ مثال: 450000",
      stock: "تعداد موجودی را بفرست؛ مثال: 12"
    };

    return send(env, chat,
      (hints[field] || `مقدار جدید «${PRODUCT_LABELS[field]}» را بفرست.`) +
      "\n\nلغو: /cancel"
    );
  }

  if (action === "pt") {
    await env.DB.prepare(
      "UPDATE products SET active = 1 - active, updated_at = unixepoch() WHERE id = ?"
    ).bind(itemId).run();

    return productMenu(env, chat, itemId);
  }

  if (action === "pd") {
    return send(env, chat, "این محصول حذف شود؟",
      [[button("بله، حذف شود", `px:${itemId}`), button("نه", `p:${itemId}`)]]
    );
  }

  if (action === "px") {
    const used = await env.DB.prepare(
      "SELECT 1 AS found FROM order_items WHERE product_id = ? LIMIT 1"
    ).bind(itemId).first();

    if (used) {
      await env.DB.prepare("UPDATE products SET active = 0 WHERE id = ?")
        .bind(itemId).run();

      await send(env, chat,
        "این محصول سابقه سفارش دارد؛ برای حفظ سوابق، به‌جای حذف پنهان شد."
      );
    } else {
      await env.DB.prepare("DELETE FROM products WHERE id = ?")
        .bind(itemId).run();
    }

    return listMenu(env, chat, "products");
  }

  if (action === "newpost") {
    const postId = id();

    await env.DB.prepare("INSERT INTO posts(id) VALUES (?)")
      .bind(postId).run();

    return postMenu(env, chat, postId);
  }

  if (action === "b") return postMenu(env, chat, itemId);

  if (action === "be" && ["title", "body"].includes(field)) {
    await setSession(env, chat, { kind: "post", id: itemId, field });

    return send(env, chat,
      `متن جدید را بفرست.\nحداکثر ${field === "title" ? "۱۴۰" : "۳۵۰۰"} کاراکتر.\nلغو: /cancel`
    );
  }

  if (action === "bt") {
    await env.DB.prepare("UPDATE posts SET active = 1 - active WHERE id = ?")
      .bind(itemId).run();

    return postMenu(env, chat, itemId);
  }

  if (action === "bd") {
    return send(env, chat, "نوشته حذف شود؟",
      [[button("بله", `bx:${itemId}`), button("نه", `b:${itemId}`)]]
    );
  }

  if (action === "bx") {
    await env.DB.prepare("DELETE FROM posts WHERE id = ?")
      .bind(itemId).run();

    return listMenu(env, chat, "posts");
  }

  if (action === "settings") return settingMenu(env, chat);

  if (action === "se" && Object.hasOwn(SETTING_LABELS, itemId)) {
    await setSession(env, chat, { kind: "setting", key: itemId });

    return send(env, chat,
      `مقدار جدید «${SETTING_LABELS[itemId]}» را بفرست.\n` +
      "رنگ: مانند #166454\nهزینه ارسال: به تومان\n" +
      "برای خالی‌کردن موارد اختیاری: -\nلغو: /cancel"
    );
  }

  if (action === "o") return orderMessage(env, chat, itemId);

  if (action === "oc") {
    return send(env, chat,
      "سفارش لغو شود؟ موجودی محصولات برگردانده می‌شود.",
      [[button("بله، لغو شود", `os:${itemId}:cancelled`), button("بازگشت", `o:${itemId}`)]]
    );
  }

  if (action === "os") {
    const allowedFrom = {
      confirmed: ["new"],
      sent: ["confirmed"],
      cancelled: ["new", "confirmed"]
    }[field];

    if (!allowedFrom) return;

    const placeholders = allowedFrom.map(() => "?").join(",");

    const result = await env.DB.prepare(`
      UPDATE orders SET status = ?
      WHERE id = ? AND status IN (${placeholders})
    `).bind(field, itemId, ...allowedFrom).run();

    if (!result.meta.changes) {
      await send(env, chat, "این تغییر وضعیت دیگر مجاز نیست یا قبلاً انجام شده است.");
    }

    return orderMessage(env, chat, itemId);
  }

  if (action === "stats") {
    const p = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM products WHERE active = 1"
    ).first();

    const o = await env.DB.prepare(`
      SELECT COUNT(*) AS n,
      COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) AS total
      FROM orders
    `).first();

    return send(env, chat,
      `📊 آمار فروشگاه\n\nمحصول منتشرشده: ${MONEY.format(p.n)}` +
      `\nتعداد سفارش: ${MONEY.format(o.n)}` +
      `\nارزش سفارش‌های لغونشده: ${MONEY.format(o.total)} تومان` +
      "\n\nارزش سفارش به معنی مبلغ پرداخت‌شده نیست.",
      [[button("🏠 منوی اصلی", "home")]]
    );
  }
}

async function handleTelegram(request, env) {
  if (
    !env.TELEGRAM_WEBHOOK_SECRET ||
    request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET
  ) {
    return json({ error: "Forbidden" }, 403);
  }

  const update = await readJson(request, 262144);
  const query = update.callback_query;
  const message = query?.message || update.message;
  const from = query?.from || update.message?.from;

  // پنل فقط در گفت‌وگوی خصوصی مدیر کار می‌کند.
  if (
    !from ||
    !message ||
    message.chat?.type !== "private" ||
    String(message.chat.id) !== String(from.id) ||
    !adminIds(env).includes(String(from.id))
  ) {
    return json({ ok: true });
  }

  if (!Number.isSafeInteger(update.update_id)) {
    return json({ ok: true });
  }

  const claim = await env.DB.prepare(
    "INSERT OR IGNORE INTO telegram_updates(id) VALUES (?)"
  ).bind(update.update_id).run();

  if (!claim.meta.changes) return json({ ok: true });

  const chat = message.chat.id;

  try {
    if (query) {
      await tg(env, "answerCallbackQuery", { callback_query_id: query.id });

      // انتخاب دکمه جدید، عملیات ورود متن قبلی را کنار می‌گذارد.
      await env.DB.prepare("DELETE FROM sessions WHERE admin_id = ?")
        .bind(String(chat)).run();

      await callback(env, chat, String(query.data || "").slice(0, 64));
    } else {
      const text = message.text || "";

      if (/^\/(start|cancel)(@\w+)?(?:\s|$)/.test(text)) {
        await home(env, chat);
      } else {
        const sessionRow = await env.DB.prepare(`
          SELECT payload FROM sessions
          WHERE admin_id = ? AND updated_at > unixepoch() - 3600
        `).bind(String(chat)).first();

        if (sessionRow) {
          await receiveSession(env, chat, message, JSON.parse(sessionRow.payload));
        } else {
          await home(env, chat);
        }
      }
    }
  } catch (error) {
    // خطای کنترل‌شده به مدیر نمایش داده می‌شود؛ توکن و SQL نمایش داده نمی‌شوند.
    const safe = error instanceof HttpError ||
      /وارد کن|بفرست|کاراکتر|ویژگی|فرمت|محدوده|مگابایت|فیلد|معتبر|وجود ندارد/.test(error.message);

    try {
      await send(env, chat,
        "⚠️ " + (safe ? error.message : "عملیات کامل نشد. وضعیت را بررسی و دوباره تلاش کن.")
      );
    } catch {
      console.error("Telegram reply failed");
    }
  }

  return json({ ok: true });
}

async function media(request, env, ctx, productId) {
  const product = await env.DB.prepare(
    "SELECT photo FROM products WHERE id = ? AND active = 1"
  ).bind(productId).first();

  if (!product?.photo) return new Response("Not found", { status: 404 });

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(product.photo)
  );

  const hash = [...new Uint8Array(digest)]
    .map(x => x.toString(16).padStart(2, "0")).join("");

  const cacheUrl = new URL(request.url);
  cacheUrl.search = "";
  cacheUrl.pathname = "/_image-cache/" + hash;

  const key = new Request(cacheUrl.toString());
  const cache = caches.default;
  const cached = await cache.match(key);

  if (cached) return cached;

  const file = await tg(env, "getFile", { file_id: product.photo });

  if (!file.file_path || !file.file_size || file.file_size > 4 * 1024 * 1024) {
    return new Response("Image unavailable", { status: 404 });
  }

  const response = await fetch(
    `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${file.file_path}`
  );

  if (!response.ok) {
    return new Response("Image unavailable", { status: 502 });
  }

  const data = await response.arrayBuffer();

  if (data.byteLength > 4 * 1024 * 1024) {
    return new Response("Image too large", { status: 413 });
  }

  // عکس‌های Photo تلگرام JPEG هستند؛ SVG و محتوای HTML پذیرفته نمی‌شوند.
  const bytes = new Uint8Array(data);

  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return new Response("Unsupported image", { status: 415 });
  }

  const result = new Response(data, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff"
    }
  });

  ctx.waitUntil(cache.put(key, result.clone()));
  return result;
}

async function rateLimit(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const window = Math.floor(Date.now() / 600000);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(
      env.TELEGRAM_WEBHOOK_SECRET + ":" + ip + ":" + window
    )
  );

  const key = [...new Uint8Array(digest)]
    .map(x => x.toString(16).padStart(2, "0")).join("");

  const result = await env.DB.prepare(`
    INSERT INTO rate_limits(key, n, expires)
    VALUES (?, 1, unixepoch() + 1200)
    ON CONFLICT(key) DO UPDATE SET n = n + 1
    RETURNING n
  `).bind(key).first();

  if (result.n > 10) {
    throw new HttpError(429, "تعداد تلاش‌ها زیاد است. چند دقیقه بعد دوباره امتحان کنید.");
  }
}

async function checkout(request, env, ctx) {
  const url = new URL(request.url);

  if (request.headers.get("Origin") !== url.origin) {
    throw new HttpError(403, "درخواست از مبدأ مجاز ارسال نشده است.");
  }

  if (!env.TELEGRAM_WEBHOOK_SECRET) {
    throw new HttpError(503, "راه‌اندازی فروشگاه هنوز کامل نشده است.");
  }

  await rateLimit(request, env);

  const body = await readJson(request);

  if (!/^[0-9a-f-]{36}$/i.test(body.clientKey || "")) {
    throw new HttpError(400, "شناسه درخواست معتبر نیست.");
  }

  const previous = await env.DB.prepare(
    "SELECT id FROM orders WHERE client_key = ?"
  ).bind(body.clientKey).first();

  if (previous) return json({ ok: true, orderId: previous.id });

  if (env.TURNSTILE_SITE_KEY) {
    if (!env.TURNSTILE_SECRET_KEY) {
      throw new HttpError(503, "تنظیمات ضدربات کامل نیست.");
    }

    const token = String(body.turnstileToken || "").slice(0, 2048);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: request.headers.get("CF-Connecting-IP") || ""
        })
      }
    );

    const verification = await response.json();

    if (!verification.success) {
      throw new HttpError(400, "بررسی ضدربات ناموفق بود؛ دوباره تلاش کنید.");
    }
  }

  const name = cleanText(body.name, 2, 100, "نام");
  const address = cleanText(body.address, 10, 1000, "نشانی");
  const phone = normalDigits(String(body.phone || ""))
    .replace(/[\s()-]/g, "");

  if (!/^\+?\d{8,15}$/.test(phone)) {
    throw new HttpError(400, "شماره تماس معتبر وارد کنید.");
  }

  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 25) {
    throw new HttpError(400, "سبد خرید معتبر نیست.");
  }

  const merged = new Map();

  for (const item of body.items) {
    if (
      typeof item.id !== "string" ||
      item.id.length > 80 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      throw new HttpError(400, "تعداد محصول معتبر نیست.");
    }

    const quantity = (merged.get(item.id) || 0) + item.quantity;

    if (quantity > 99) {
      throw new HttpError(400, "حداکثر تعداد هر محصول ۹۹ عدد است.");
    }

    merged.set(item.id, quantity);
  }

  const ids = [...merged.keys()];
  const placeholders = ids.map(() => "?").join(",");

  const { results: products } = await env.DB.prepare(
    `SELECT * FROM products WHERE active = 1 AND id IN (${placeholders})`
  ).bind(...ids).all();

  if (products.length !== ids.length) {
    throw new HttpError(409, "یکی از محصولات دیگر قابل سفارش نیست؛ سبد را اصلاح کنید.");
  }

  for (const p of products) {
    if (p.stock < merged.get(p.id)) {
      throw new HttpError(409, `موجودی «${p.title}» کافی نیست.`);
    }
  }

  const s = await settings(env);
  const orderId = crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();

  const statements = [
    env.DB.prepare(`
      INSERT INTO orders
      (id, client_key, customer_name, phone, address, shipping, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId, body.clientKey, name, phone, address,
      s.shipping_fee, s.shipping_fee
    ),
    ...products.map(p =>
      env.DB.prepare(`
        INSERT INTO order_items
        (order_id, product_id, title, unit_price, quantity)
        VALUES (?, ?, ?, ?, ?)
      `).bind(orderId, p.id, p.title, p.price, merged.get(p.id))
    )
  ];

  try {
    await env.DB.batch(statements);
  } catch {
    const duplicate = await env.DB.prepare(
      "SELECT id FROM orders WHERE client_key = ?"
    ).bind(body.clientKey).first();

    if (duplicate) return json({ ok: true, orderId: duplicate.id });

    throw new HttpError(409,
      "قیمت یا موجودی محصول تغییر کرده است. صفحه را تازه‌سازی و دوباره تلاش کنید."
    );
  }

  ctx.waitUntil(
    notifyOrder(env, orderId).catch(() => console.error("Order notification pending"))
  );

  return json({ ok: true, orderId }, 201);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      if (pathname === "/api/health" && request.method === "GET") {
        await env.DB.prepare("SELECT 1 FROM products LIMIT 1").first();

        return json({
          ok: true,
          ready: Boolean(
            env.TELEGRAM_BOT_TOKEN &&
            env.TELEGRAM_ADMIN_IDS &&
            env.TELEGRAM_WEBHOOK_SECRET
          )
        });
      }

      if (pathname === "/api/telegram" && request.method === "POST") {
        return await handleTelegram(request, env);
      }

      if (pathname === "/api/config" && request.method === "GET") {
        return json({
          ...(await settings(env)),
          turnstile_site_key: env.TURNSTILE_SITE_KEY || ""
        });
      }

      if (pathname === "/api/products" && request.method === "GET") {
        const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
        const category = (url.searchParams.get("category") || "").slice(0, 60);
        const page = Math.max(1, Math.min(100000, Number(url.searchParams.get("page")) || 1));
        const sort = {
          newest: "created_at DESC, id DESC",
          cheap: "price ASC, id DESC",
          expensive: "price DESC, id DESC"
        }[url.searchParams.get("sort")] || "created_at DESC, id DESC";

        const where = [
          "active = 1",
          "(? = '' OR instr(lower(title || ' ' || description), lower(?)) > 0)",
          "(? = '' OR category = ?)"
        ].join(" AND ");

        const values = [q, q, category, category];

        const result = await env.DB.batch([
          env.DB.prepare(
            `SELECT * FROM products WHERE ${where} ORDER BY ${sort} LIMIT 12 OFFSET ?`
          ).bind(...values, (Math.floor(page) - 1) * 12),
          env.DB.prepare(
            `SELECT COUNT(*) AS n FROM products WHERE ${where}`
          ).bind(...values),
          env.DB.prepare(
            "SELECT DISTINCT category FROM products WHERE active = 1 ORDER BY category LIMIT 100"
          )
        ]);

        return json({
          products: result[0].results.map(publicProduct),
          total: result[1].results[0].n,
          categories: result[2].results.map(x => x.category)
        });
      }

      if (pathname.startsWith("/api/product/") && request.method === "GET") {
        const productId = decodeURIComponent(pathname.slice("/api/product/".length));

        const p = await env.DB.prepare(
          "SELECT * FROM products WHERE id = ? AND active = 1"
        ).bind(productId).first();

        return p ? json(publicProduct(p)) : json({ error: "محصول پیدا نشد." }, 404);
      }

      if (pathname === "/api/posts" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT id, title, body, created_at FROM posts WHERE active = 1 ORDER BY created_at DESC LIMIT 30"
        ).all();

        return json(results);
      }

      if (pathname === "/api/orders" && request.method === "POST") {
        return await checkout(request, env, ctx);
      }

      if (pathname.startsWith("/media/") && request.method === "GET") {
        return await media(
          request, env, ctx,
          decodeURIComponent(pathname.slice("/media/".length))
        );
      }

      if (pathname === "/robots.txt") {
        return new Response(
          "User-agent: *\nAllow: /\nDisallow: /api/\n",
          { headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
      }

      if (pathname === "/" && request.method === "GET") {
        return new Response(storefront, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
            "Content-Security-Policy":
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "img-src 'self' data:; " +
              "connect-src 'self' https://challenges.cloudflare.com; " +
              "frame-src https://challenges.cloudflare.com; " +
              "object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
          }
        });
      }

      return json({ error: "مسیر پیدا نشد." }, 404);
    } catch (error) {
      if (!(error instanceof HttpError)) {
        console.error("Request failed:", pathname);
      }

      return json({
        error: error instanceof HttpError
          ? error.message
          : "خطایی رخ داد. کمی بعد دوباره تلاش کنید."
      }, error instanceof HttpError ? error.status : 500);
    }
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil((async () => {
      await env.DB.batch([
        env.DB.prepare(
          "DELETE FROM telegram_updates WHERE created_at < unixepoch() - 604800"
        ),
        env.DB.prepare(
          "DELETE FROM sessions WHERE updated_at < unixepoch() - 3600"
        ),
        env.DB.prepare(
          "DELETE FROM rate_limits WHERE expires < unixepoch()"
        )
      ]);

      const { results } = await env.DB.prepare(
        "SELECT id FROM orders WHERE notified = 0 ORDER BY created_at LIMIT 20"
      ).all();

      for (const order of results) {
        try {
          await notifyOrder(env, order.id);
        } catch {
          console.error("Scheduled notification failed");
        }
      }
    })());
  }
};