import assets from './assets.json' with {type: 'json'};


self.addEventListener('install', function (event) {
	event.waitUntil(preLoad());
});

function preLoad() {
	console.log('Installing web app');
	return caches.open('offline').then(function (cache) {
		console.log('caching index and important routes');
		return cache.addAll(assets);
	});
}

self.addEventListener('fetch', function (event) {
	event.respondWith(checkResponse(event.request)
		.catch(() => returnFromCache(event.request)));

	event.waitUntil(addToCache(event.request));
});

function checkResponse(request) {
	return new Promise(function (fulfill, reject) {
		fetch(request).then(function (response) {
			if (response.status !== 404) {
				fulfill(response);
			} else {
				reject();
			}
		}, reject);
	});
}

async function addToCache(request) {
	const cache = await caches.open('offline');
	const response = await fetch(request);
	console.log(response.url + ' was cached');
	return cache.put(request, response);
}

function returnFromCache(request) {
	return caches.open('offline').then(function (cache) {
		return cache.match(request).then(function (matching) {
			if (!matching || matching.status === 404) {
				return cache.match('offline.html');
			} else {
				return matching;
			}
		});
	});
}