import Koa from 'koa'
import http from 'http'
import { httpPort } from './environment'
import nodemailer from 'nodemailer'
import Router from '@koa/router'
import dotenv from 'dotenv'
import { koaBody } from 'koa-body'
import { BadRequestError, errorHandler } from './errorHandler'
import cors from '@koa/cors'

dotenv.config()

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'onuralpbicernoreply@gmail.com',
		pass: 'rqbnibevmtabgvwq',
	},
})

const app = new Koa()
const apiRouter = new Router()

apiRouter.use(errorHandler)
apiRouter.post('/contact', async (ctx) => {
	const { name, email, subject, description } = ctx.request.body ?? {}

	if (!name || !email || !subject)
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

app.use(koaBody())
app.use(
	cors({
		origin: '*',
	}),
)
app.use(apiRouter.routes())

http.createServer(app.callback()).listen(httpPort, () => {
	console.log(`listening on port ${httpPort}`)
})
