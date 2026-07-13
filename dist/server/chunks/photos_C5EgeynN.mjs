globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
const prerender = false;
const GET = async () => {
  const previewStore = env?.peachy_preview_store;
  if (!previewStore) {
    const mockPhotos = [
      "full_body-moon-warewolf-side_facing-shadow-crawling-sailor_uniform-mountain.png",
      "half_body-sakura-kimono-portrait-standing-smiling-spring_garden.png",
      "chibi-sweet_peach-maid_dress-winking-holding_tray-cafe.png",
      "landscape-sunset-sea-beach-clouds-peaceful.png",
      "cyberpunk-neon-hud-night_city-futuristic_mask-headshot.png"
    ];
    return new Response(JSON.stringify(mockPhotos), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  try {
    const listResult = await previewStore.list();
    const keys = listResult.objects.map((obj) => obj.key);
    return new Response(JSON.stringify(keys), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
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
