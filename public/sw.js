const CACHE_NAME = 'zycoon-static-v2';
const RUNTIME = 'zycoon-runtime'
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME && key !== RUNTIME) return caches.delete(key)
        return Promise.resolve()
      })
    ))
  )
  self.clients.claim()
})

function isNavigationRequest(request){
  return request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))
}

// Stale-while-revalidate for assets, network-first for navigation
self.addEventListener('fetch', (event) => {
  const req = event.request
  // navigation requests: try network first, fallback to cache
  if (isNavigationRequest(req)){
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone()
        caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy))
        return res
      }).catch(() => caches.match('/index.html'))
    )
    return
  }

  // assets (css/js/images): stale-while-revalidate
  const url = new URL(req.url)
  const isStatic = url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.svg') || url.pathname.startsWith('/assets/')
  if (isStatic){
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          caches.open(RUNTIME).then(cache => cache.put(req, res.clone()))
          return res
        }).catch(()=>undefined)
        return cached || network
      })
    )
    return
  }

  // default: try network, fallback to cache
  event.respondWith(
    fetch(req).then(res => res).catch(()=>caches.match(req))
  )
})
