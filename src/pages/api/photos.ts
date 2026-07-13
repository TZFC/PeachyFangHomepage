import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = (context.locals as any).runtime?.env;
  const previewStore = env?.peachy_preview_store;

  if (!previewStore) {
    // Local dev fallback list
    const mockPhotos = [
      "full_body-moon-warewolf-side_facing-shadow-crawling-sailor_uniform-mountain.png",
      "half_body-sakura-kimono-portrait-standing-smiling-spring_garden.png",
      "chibi-sweet_peach-maid_dress-winking-holding_tray-cafe.png",
      "landscape-sunset-sea-beach-clouds-peaceful.png",
      "cyberpunk-neon-hud-night_city-futuristic_mask-headshot.png"
    ];
    return new Response(JSON.stringify(mockPhotos), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const listResult = await previewStore.list();
    const keys = listResult.objects.map((obj: any) => obj.key);
    return new Response(JSON.stringify(keys), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
