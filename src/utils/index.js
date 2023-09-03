export const getFileNameWithExtension = (url) => {
	url = url.replaceAll("\\", "/");
	const _url = decodeURIComponent(url);

	const m = `${_url.toString().match(/(?:.*\/)?([^\/]+)/)}`;
	if (m && m.split(",").length > 1) {
		return m.split(",")[1].replace(/(\?.*)/, "");
	}
	return "";
};

export const getFileExtension = (url) => {
	const arr = getFileNameWithExtension(url).split(".");
	if (arr.length > 1) return getFileNameWithExtension(url).split(".").pop();
	return null;
};