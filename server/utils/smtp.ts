import nodemailer from 'nodemailer'

export function createSmtpTransport(config: Record<string, string>, password: string) {
  return nodemailer.createTransport({
    host: config.host,
    port: Number(config.port || 587),
    secure: config.secure === 'true',
    auth: { user: config.username, pass: password },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true
  })
}
