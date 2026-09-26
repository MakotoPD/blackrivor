import sanitizeHtml from 'sanitize-html'

export function cleanNewsletterHtml(value: unknown) {
  return sanitizeHtml(String(value || ''), {
    allowedTags: ['p', 'br', 'h2', 'h3', 'strong', 'em', 'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'hr', 'code', 'pre'],
    allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt', 'title'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }, true)
    }
  }).trim()
}

export function renderNewsletterHtml(content: string, unsubscribeUrl: string, siteUrl: string) {
  const safeSiteUrl = siteUrl.replace(/\/$/, '')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Black Rivor</title></head><body style="margin:0;background:#f3f1eb;color:#171714;font-family:Arial,sans-serif"><div style="max-width:680px;margin:0 auto;padding:32px 20px"><div style="background:#11110f;color:#fff;padding:18px 24px;font-size:20px;font-weight:700">BLACK RIVOR<span style="color:#c9ff32">.</span></div><main style="background:#fff;padding:32px 24px;line-height:1.65">${cleanNewsletterHtml(content)}</main><footer style="padding:28px 20px;text-align:center;color:#62625d;font-size:12px;line-height:1.6"><p>Black Rivor Car Wrapping · Sunderland, United Kingdom</p><p>You are receiving this because you subscribed to studio updates.</p><a href="${unsubscribeUrl}" style="display:inline-block;margin-top:8px;border:1px solid #171714;border-radius:999px;padding:9px 18px;color:#171714;text-decoration:none;font-weight:700">Unsubscribe</a><p style="margin-top:18px"><a href="${safeSiteUrl}" style="color:#62625d">${safeSiteUrl.replace(/^https?:\/\//, '')}</a></p></footer></div></body></html>`
}

export function newsletterPlainText(content: string, unsubscribeUrl: string) {
  const text = sanitizeHtml(cleanNewsletterHtml(content), { allowedTags: [], allowedAttributes: {} })
  return `${text}\n\nBlack Rivor Car Wrapping · Sunderland, United Kingdom\nUnsubscribe: ${unsubscribeUrl}`
}
