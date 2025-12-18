
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js');
}
if ('launchQueue' in window) {
	window.launchQueue.setConsumer((launchParams) => {
		for (const fileHandle of launchParams.files) {
			fileHandle.getFile().then(handleFile);
			return; // only one
		}
	});
}
