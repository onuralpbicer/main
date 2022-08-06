declare namespace NodeJS {
	export interface ProcessEnv {
		NODE_ENV: 'development' | undefined
	}
}

declare module 'koa-force-https'
