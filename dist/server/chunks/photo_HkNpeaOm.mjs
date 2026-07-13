globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
const prerender = false;
const GET = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const key = searchParams.get("key");
  const type = searchParams.get("type") || "preview";
  if (!key) {
    return new Response(JSON.stringify({ error: "Missing 'key' query parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const previewStore = env?.peachy_preview_store;
  const fullStore = env?.peachy_full_store;
  const bucket = type === "full" ? fullStore : previewStore;
  if (!bucket) {
    const isLandscape = key.includes("landscape") || key.includes("scene") || key.includes("beach");
    const width = isLandscape ? type === "full" ? 1920 : 640 : type === "full" ? 1440 : 480;
    const height = isLandscape ? type === "full" ? 1080 : 360 : type === "full" ? 1920 : 640;
    const cleanName = key.replace(/\.[^/.]+$/, "");
    const tags = cleanName.split("-");
    const formattedTags = tags.map((t) => `#${t}`).join(" ");
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="peachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#aa7279" />
      <stop offset="50%" stop-color="#fd9594" />
      <stop offset="100%" stop-color="#ff3e72" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1d7dc" stroke-width="1" opacity="0.15"/>
    </pattern>
  </defs>
  
  <rect width="100%" height="100%" fill="url(#peachGrad)" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#f1d7dc" stroke-width="2" opacity="0.3" rx="12" />

  <g transform="translate(${width / 2}, ${height / 2 - (type === "full" ? 80 : 40)}) scale(${type === "full" ? 2.5 : 1.2})">
    <circle cx="0" cy="0" r="40" fill="#f3f3f3" opacity="0.2"/>
    <text x="0" y="10" dominant-baseline="middle" text-anchor="middle" font-size="45">🍑</text>
  </g>

  <text x="50%" y="${height / 2 + (type === "full" ? 60 : 30)}" dominant-baseline="middle" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="${type === "full" ? 44 : 20}px" font-weight="900" fill="#f3f3f3" letter-spacing="2">
    PEACHYFANG GALLERY
  </text>
  
  <text x="50%" y="${height / 2 + (type === "full" ? 120 : 65)}" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', sans-serif" font-size="${type === "full" ? 28 : 14}px" font-weight="600" fill="#f1d7dc" opacity="0.9">
    ${type === "full" ? "Original Full-Resolution" : "480p WebP Preview"}
  </text>

  <text x="50%" y="${height - (type === "full" ? 100 : 50)}" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', sans-serif" font-size="${type === "full" ? 24 : 12}px" font-weight="500" fill="#f3f3f3" opacity="0.75">
    ${formattedTags}
  </text>
</svg>`;
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
  try {
    const object = await bucket.get(key);
    if (!object) {
      return new Response("Object not found in R2", { status: 404 });
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=86400");
    if (type === "preview") {
      headers.set("content-type", "image/webp");
    } else {
      headers.set("content-type", "image/png");
    }
    return new Response(object.body, { headers });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
