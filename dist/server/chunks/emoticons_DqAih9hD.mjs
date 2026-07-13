globalThis.process ??= {};
globalThis.process.env ??= {};
const prerender = false;
const GET = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const fileName = searchParams.get("file");
  const env = context.locals.runtime?.env;
  const emoticonsStore = env?.peachy_emoticons_store;
  if (!emoticonsStore) {
    if (fileName) {
      const emotion = fileName.replace(/\.[^/.]+$/, "");
      let faceSVG = "";
      switch (emotion) {
        case "sad_peach":
          faceSVG = `
            <!-- Crying / Sad Face -->
            <path d="M72 105 L84 93 M84 105 L72 93" stroke="#4a3134" stroke-width="5" stroke-linecap="round"/>
            <path d="M116 105 L128 93 M128 105 L116 93" stroke="#4a3134" stroke-width="5" stroke-linecap="round"/>
            <path d="M92 135 Q100 120 108 135" stroke="#4a3134" stroke-width="5" stroke-linecap="round" fill="none"/>
            <!-- Teardrops -->
            <path d="M78 112 Q83 125 78 128 Q73 125 78 112 Z" fill="#66ccff"/>
            <path d="M122 112 Q127 125 122 128 Q117 125 122 112 Z" fill="#66ccff"/>
          `;
          break;
        case "surprised_peach":
          faceSVG = `
            <!-- Surprised Face -->
            <circle cx="80" cy="100" r="8" fill="#4a3134"/>
            <circle cx="120" cy="100" r="8" fill="#4a3134"/>
            <circle cx="100" cy="128" r="10" fill="#4a3134"/>
            <circle cx="65" cy="115" r="8" fill="#ff3e72" opacity="0.3"/>
            <circle cx="135" cy="115" r="8" fill="#ff3e72" opacity="0.3"/>
          `;
          break;
        case "love_peach":
          faceSVG = `
            <!-- Heart Eyes -->
            <g transform="translate(-20, 15)">
              <path d="M 80 95 C 80 95 68 83 68 75 C 68 67 78 67 80 73 C 82 67 92 67 92 75 C 92 83 80 95 80 95 Z" fill="#ff3e72"/>
            </g>
            <g transform="translate(20, 15)">
              <path d="M 80 95 C 80 95 68 83 68 75 C 68 67 78 67 80 73 C 82 67 92 67 92 75 C 92 83 80 95 80 95 Z" fill="#ff3e72"/>
            </g>
            <path d="M90 120 Q100 135 110 120" stroke="#4a3134" stroke-width="5" stroke-linecap="round" fill="none"/>
          `;
          break;
        case "wink_peach":
          faceSVG = `
            <!-- Winking Face -->
            <path d="M70 100 Q80 90 90 100" stroke="#4a3134" stroke-width="5" stroke-linecap="round" fill="none"/>
            <circle cx="120" cy="98" r="8" fill="#4a3134"/>
            <path d="M90 118 Q100 130 110 118" stroke="#4a3134" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M95 122 C95 132 105 132 105 122 Z" fill="#ff3e72"/>
            <circle cx="65" cy="112" r="8" fill="#ff3e72" opacity="0.4"/>
            <circle cx="135" cy="112" r="8" fill="#ff3e72" opacity="0.4"/>
          `;
          break;
        case "happy_peach":
        default:
          faceSVG = `
            <!-- Happy Face -->
            <path d="M70 100 Q80 90 90 100" stroke="#4a3134" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M110 100 Q120 90 130 100" stroke="#4a3134" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M90 122 Q100 132 110 122" stroke="#4a3134" stroke-width="5" stroke-linecap="round" fill="none"/>
            <circle cx="65" cy="112" r="8" fill="#ff3e72" opacity="0.4"/>
            <circle cx="135" cy="112" r="8" fill="#ff3e72" opacity="0.4"/>
          `;
          break;
      }
      const svg = `<svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="peachEmojiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff3e72" />
            <stop offset="100%" stop-color="#fd9594" />
          </linearGradient>
        </defs>
        <!-- Peach Body -->
        <path d="M100 55 C125 55 150 75 150 110 C150 148 105 165 100 165 C95 165 50 148 50 110 C50 75 75 55 100 55 Z" fill="url(#peachEmojiGrad)" stroke="#aa7279" stroke-width="4" />
        <path d="M100 55 C110 55 125 70 125 95 C125 128 102 148 100 148 Z" fill="#fd9594" opacity="0.3" />
        <!-- Leaf -->
        <path d="M100 55 C95 35 78 30 70 35 C62 40 70 50 100 55 Z" fill="#aa7279" />
        
        <!-- Face Features -->
        ${faceSVG}
      </svg>`;
      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }
    const mockEmoticons = [
      { key: "happy_peach.png", url: "/api/emoticons?file=happy_peach.png" },
      { key: "sad_peach.png", url: "/api/emoticons?file=sad_peach.png" },
      { key: "surprised_peach.png", url: "/api/emoticons?file=surprised_peach.png" },
      { key: "love_peach.png", url: "/api/emoticons?file=love_peach.png" },
      { key: "wink_peach.png", url: "/api/emoticons?file=wink_peach.png" }
    ];
    return new Response(JSON.stringify(mockEmoticons), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  if (fileName) {
    try {
      const object = await emoticonsStore.get(fileName);
      if (!object) {
        return new Response("Emoticon Not Found", { status: 404 });
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(object.body, { headers });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  }
  try {
    const list = await emoticonsStore.list();
    const emoticonFiles = list.objects.filter((obj) => obj.key.toLowerCase().endsWith(".png") || obj.key.toLowerCase().endsWith(".webp") || obj.key.toLowerCase().endsWith(".gif")).map((obj) => ({
      key: obj.key,
      url: `/api/emoticons?file=${encodeURIComponent(obj.key)}`
    }));
    return new Response(JSON.stringify(emoticonFiles), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
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
