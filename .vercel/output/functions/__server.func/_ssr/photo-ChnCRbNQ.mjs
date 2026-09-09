//#region node_modules/.nitro/vite/services/ssr/assets/photo-ChnCRbNQ.js
var MAX_EDGE = 1200;
var JPEG_QUALITY = .82;
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("이미지를 불러오지 못했습니다."));
		img.src = src;
	});
}
/** Resize to max 1200px edge and encode JPEG 0.82 data URL. */
async function compressImage(file) {
	const objectUrl = URL.createObjectURL(file);
	try {
		const img = await loadImage(objectUrl);
		let { width, height } = img;
		if (!width || !height) throw new Error("이미지 크기를 읽을 수 없습니다.");
		if (width > MAX_EDGE || height > MAX_EDGE) {
			const scale = MAX_EDGE / Math.max(width, height);
			width = Math.round(width * scale);
			height = Math.round(height * scale);
		}
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("캔버스를 사용할 수 없습니다.");
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, width, height);
		ctx.drawImage(img, 0, 0, width, height);
		return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}
//#endregion
export { compressImage as t };
