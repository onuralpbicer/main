import dotenv from 'dotenv'

dotenv.config()

export const httpPort = process.env.NODE_ENV === 'development' ? 3080 : 443
