import Koa from 'koa'
import serve from 'koa-static'
import path from 'path'
import http from 'http'
import https from 'https'
import { httpPort } from './environment'
import fs from 'fs/promises'

const html =
	process.env.NODE_ENV === 'development'
		? path.join(__dirname, '..', 'public')
		: '/var/www/html'

const app = new Koa()

app.use(async (ctx, next) => {
	// TODO: Middleware example
	await next()
})

app.use(serve(html))

http.createServer(app.callback()).listen(httpPort, () => {
	console.log(`listening on port ${httpPort}`)
})
