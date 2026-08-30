#!/opt/taichios/node/bin/node

import { createServer } from 'node:http'

const response = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

createServer((req, res) => {
  if (req.url === '/health') return response(res, 200, { status: 'ok', provider: 'taichios-mock' })
  if (req.url === '/v1/models') return response(res, 200, { object: 'list', data: [{ id: 'taichios-mock', object: 'model' }] })
  if (req.url === '/v1/chat/completions' && req.method === 'POST') {
    req.resume()
    return response(res, 200, {
      id: 'taichios-offline',
      object: 'chat.completion',
      model: 'taichios-mock',
      choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: 'TaiChiOS offline mock provider is ready.' } }],
    })
  }
  response(res, 404, { error: { message: 'not found' } })
}).listen(11435, '127.0.0.1')
