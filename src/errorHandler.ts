import { Context, Next } from 'koa'

export async function errorHandler(ctx: Context, next: Next) {
	try {
		await next()
	} catch (e) {
		if (e instanceof Error) {
			ctx.status = (e as any).code || 500

			ctx.body = {
				message: e.message || e.name || e,
				name: e.name || 'UnknownError',
			}
		} else {
			ctx.status = 500
			ctx.body = {
				message: e ?? 'Unknown Error',
				name: 'UnknownError',
			}
		}
	}
}

class ExtendedError extends Error {
	code: number
	constructor(code: number, message = '') {
		super(message)

		this.code = code
	}
}

export class BadRequestError extends ExtendedError {
	constructor(message?: string) {
		super(400, message)
	}
}
