import Koa from 'koa'
import path from 'path'
import http from 'http'
import { httpPort } from './environment'
import nodemailer from 'nodemailer'
import Router from '@koa/router'
import Subdomain from 'koa-subdomain'
import dotenv from 'dotenv'
import send from 'koa-send'
import { koaBody } from 'koa-body'
import { BadRequestError, errorHandler } from './errorHandler'

dotenv.config()

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'onuralpbicernoreply@gmail.com',
		pass: 'rqbnibevmtabgvwq',
	},
})

const html =
	process.env.NODE_ENV === 'development'
		? path.join(__dirname, '..', 'public')
		: '/var/www/html'

const app = new Koa()
const subdomain = new Subdomain()
const testRouter = new Router()
testRouter.all('(.*)', async (ctx) => {
	ctx.body = ctx.path
})

const apiRouter = new Router()

apiRouter.use(errorHandler)
apiRouter.post('/contact', async (ctx) => {
	const { name, email, subject, description } = ctx.request.body ?? {}

	if (name === undefined || email === undefined || subject === undefined)
		throw new BadRequestError('Missing field in body')

	const mailOptions = {
		from: 'onuralpbicernoreply@gmail.com',
		to: 'onuralpbicer@gmail.com',
		subject: `Contact Form: ${subject}`,
		text: `
Contact Form Submitted:
    Name: ${name}
    From: ${email}
    Subject: ${subject}

${description ?? ''}
        `,
	}

	const sent = await transporter.sendMail(mailOptions)
	console.log(sent)
	ctx.body = {
		status: 'success',
	}
})

const htmlRouter = new Router()
htmlRouter.get('(.*)', async (ctx) => {
	return send(ctx, ctx.path, {
		root: html,
		index: 'index.html',
	})
})

subdomain
	.use('api', apiRouter.routes() as any)
	.use('portfolio-html', htmlRouter.routes() as any)
	.use('test', testRouter.routes() as any)
	.use('*', htmlRouter.routes() as any)

app.use(koaBody())
app.use(subdomain.routes())

app.subdomainOffset = process.env.NODE_ENV === 'development' ? 1 : 2

http.createServer(app.callback()).listen(httpPort, () => {
	console.log(`listening on port ${httpPort}`)
})
