const CANONICAL_HOST = 'taichios.arr2018.dpdns.org'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.hostname.endsWith('.pages.dev')) {
      url.hostname = CANONICAL_HOST
      url.protocol = 'https:'
      url.port = ''

      return Response.redirect(url.toString(), 308)
    }

    return env.ASSETS.fetch(request)
  },
}
