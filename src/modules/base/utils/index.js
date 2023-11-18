export function revisePath(path) {
	if (!path) {
		return "";
	}

	return path[0] == "/" ? path : `/${path}`;
}

export function createLink(url, id) {
	const link = document.createElement("link");
	link.href = url;
	link.type = "text/css";
	link.rel = "stylesheet";
	if (id) {
		link.id = id;
	}

	setTimeout(() => {
		document.getElementsByTagName("head").item(0)
			?.appendChild(link);
	}, 0);
}
