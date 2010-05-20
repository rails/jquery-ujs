function log() {
	try {
		console.log.apply(console, arguments);
	} catch(e) {
		//alert( Array.prototype.join.call( arguments, " "));
	}
}


