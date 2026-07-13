export const languages = {
  zh: '简体中文',
  en: 'English',
};

export const defaultLang = 'zh';

const zhDict = {
    title: "天子方辰 桃园",
    metaDesc: "天子方辰 PeachyFang 的个人主页。提供高清相册、AR合影、自制表情包仓库等丰富内容。",
    metaKeywords: "天子方辰, PeachyFang, 桃牙芳, 桃园, B站主播, 虚拟主播, Vtuber, 歌单, AR相机, 相册, 表情包",
    desc: "天子方辰 PeachyFang 🍑 欢迎来到我的桃园！<br>我是一名喜欢唱歌、打游戏和聊天的哔哩哔哩主播，很高兴在这里遇见你！",
    biliBtn: "前往 Bilibili 直播间",
    backBtn: "← 返回主页",
    photoTitle: "桃牙画廊",
    photoDesc: "浏览我的高清快照。点击照片以复制其 PNG 预览到剪贴板或下载原始分辨率大图。",
    selfieTitle: "桃牙相机",
    selfieDesc: "茄子！右滑或点击箭头按钮切换滤镜，然后按下快门进行合影吧。",
    swipeTip: "右滑或点击箭头切换滤镜",
    emoticonsTitle: "桃牙表情包",
    emoticonsDesc: "点击任何表情贴纸即可将其直接复制到剪贴板，快在聊天中使用吧！",
    searchPlaceholder: "按标签过滤（例如：full_body moon mountain）...",
    copySuccess: "已复制到剪贴板！",
    linkCopied: "链接已复制！",
    cameraAccessDenied: "相机权限被拒绝。请确保在 HTTPS/localhost 环境下并已授予权限。",
    cameraNotReady: "摄像机画面尚未准备就绪。",
    loading: "正在加载...",
    noItems: "未找到任何项目。",
    downloadBtn: "下载",
    retakeBtn: "重拍",
    selectCamera: "选择摄像头",
    cardPhotoTitle: "相册画廊",
    cardPhotoDesc: "浏览我的高清相册，复制预览和下载原图，支持标签过滤。",
    cardSelfieTitle: "合影相机",
    cardSelfieDesc: "使用各种合影框和滤镜，与我拍一张纪念合影！",
    cardEmoticonsTitle: "表情仓库",
    cardEmoticonsDesc: "收集了我的各种可爱表情包，点击可直接复制使用。"
};

const enDict = {
    title: "Peach Garden | PeachyFang Hub",
    metaDesc: "Official homepage of PeachyFang (天子方辰), a Bilibili streamer. Check out her high-resolution photo gallery, AR camera, and custom emoticons.",
    metaKeywords: "PeachyFang, 天子方辰, Peach Garden, Bilibili, Vtuber, Streamer, Gallery, AR Camera, Emoticons",
    desc: "Hi there! I'm PeachyFang (天子方辰) 🍑. Welcome to my Peach Garden!<br>I'm a Bilibili content creator and livestreamer who loves singing, gaming, and sharing sweet moments.",
    biliBtn: "Bilibili Livestream",
    backBtn: "← Back to Home",
    photoTitle: "Peachy Gallery",
    photoDesc: "Browse high-resolution snapshots. Click a photo to copy its PNG preview to clipboard or download the original.",
    selfieTitle: "AR Camera",
    selfieDesc: "Smile! Swipe or use the arrow buttons to switch overlays, then press the shutter button to take a photo.",
    swipeTip: "Swipe or click arrows to switch filters",
    emoticonsTitle: "Peachy Emoticons",
    emoticonsDesc: "Click on any emoticon sticker to copy it directly to your clipboard. Ready to use in chat!",
    searchPlaceholder: "Filter by tags (e.g. full_body moon mountain)...",
    copySuccess: "Copied to clipboard!",
    linkCopied: "Link copied!",
    cameraAccessDenied: "Camera access denied. Please ensure you are on HTTPS/localhost and have granted permissions.",
    cameraNotReady: "Camera stream not ready yet.",
    loading: "Loading...",
    noItems: "No items found.",
    downloadBtn: "Download PNG",
    retakeBtn: "Retake",
    selectCamera: "Select Camera",
    cardPhotoTitle: "Photo Gallery",
    cardPhotoDesc: "Browse high-resolution snapshots, copy previews, and download originals. Filter by tags.",
    cardSelfieTitle: "AR Camera",
    cardSelfieDesc: "Try on different camera overlays and filters to take screenshots and selfies!",
    cardEmoticonsTitle: "Emoticons",
    cardEmoticonsDesc: "Cute character sticker collection. Click any emoticon to copy the image directly!"
};

export const ui = {
  zh: zhDict,
  en: enDict,
} as const;
