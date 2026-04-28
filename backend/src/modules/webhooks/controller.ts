
import { db } from "@db/db";
import { email, emailAttachments } from "@db/schema";
import { s3Client } from "@lib/minio";
import { Elysia, t, } from "elysia";
import { extname } from "node:path";
import { Resend } from "resend";
import { Webhook } from 'svix'
const env = process.env.NODE_ENV || 'development';
const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET!)
const resendClient = new Resend(process.env.RESEND_API_KEY!)
interface resendResponse {
  created_at: Date;
  data: {
    attachments: attachment[]
    bcc: []
    cc: []
    created_at: Date
    from: string
    message_id: string
    email_id: string
    subject: string
    to: []
  }
  type: string
}
interface attachment {
  content_disposition: string,
  content_id: string,
  content_type: string,
  filename: string,
  id: string,
}

export const webHookPlugin = new Elysia({ prefix: "/webhooks" })
  .post('/resend', async ({ request, body, headers, set }) => {
    try {
      const rawPayload = await request.text()
      const svixHeaders = {
        'svix-id': headers['svix-id'] || '',
        'svix-timestamp': headers['svix-timestamp'] || '',
        'svix-signature': headers['svix-signature'] || '',
      }
      const payload = wh.verify(rawPayload, svixHeaders) as resendResponse // Throws on failure
      console.log('Verified event:', payload)
      console.log('attachments: ', payload.data.attachments)
      if (payload.type = "email.received") {
        const { data: emailResponse } = await resendClient.emails.receiving.get(
          payload.data.email_id

        )
        console.log(emailResponse)
        if (emailResponse) {
          await db
            .insert(email)
            .values({
              id: emailResponse.id,
              to: emailResponse.to,
              from: emailResponse.from,
              createdAt: new Date(emailResponse.created_at),
              subject: emailResponse.subject,
              messageId: emailResponse.message_id,
              bcc: emailResponse.bcc ?? [],
              cc: emailResponse.cc ?? [],
              replyTo: emailResponse.reply_to ?? [],
              html: emailResponse.html,
              text: emailResponse.text,
              attachments: emailResponse.attachments.map(item => item.id)
            })
            .returning()
            .onConflictDoNothing()
          const { data: attachments } =
            await resendClient.emails.receiving.attachments.list({
              emailId: emailResponse.id,
            });
          if (attachments) {
            let index = 0
            for (const attachment of attachments.data) {
              console.log(`doing attachment ${attachment.filename}`)
              // use the download_url to download attachments however you want
              const response = await fetch(attachment.download_url);
              if (!response.ok) {
                console.error(`Failed to download ${attachment.filename}`);
                continue;
              }
              const buffer = Buffer.from(await response.arrayBuffer());
              await s3Client.write(`/email/attachments/${emailResponse.id}/${attachment.id}${extname(attachment.filename ?? "unknown")}`,
                buffer,
                {
                  contentDisposition: attachment.content_disposition,
                  type: attachment.content_type
                })
              await db
                .insert(emailAttachments)
                .values({
                  id: attachment.id,
                  emailId: emailResponse.id,
                  filename: attachment.filename ?? index.toString(),
                  contentType: attachment.content_type,
                  contentId: attachment.content_id ?? "",
                  contentDisposition: attachment.content_disposition
                }).onConflictDoNothing()
              index++
            }
          }
        }
        /*
        {
  object: "email",
  id: "1b9012fb-cffa-45fb-a04d-b35ff52f5605",
  to: [ "support@mail.flexihire.link" ],
  from: "despacitoqwerty123@gmail.com",
  created_at: "2026-04-27 10:23:15.273992+00",
  subject: "testing again",
  message_id: "<CAFKw-cB-Z0=bhwwEhD2Nuxjoea-w3eKPdhw7FCDX78rzsgWz3A@mail.gmail.com>",
  bcc: [],
  cc: [],
  reply_to: [],
  html: "<div dir=\"ltr\">hahoeoheo</div>\n",
  text: "hahoeoheo\n",
  headers: {
    "return-path": "despacitoqwerty123@gmail.com",
    received: "[\"from mail-wr1-f52.google.com (mail-wr1-f52.google.com [209.85.221.52]) by inbound-smtp.ap-northeast-1.amazonaws.com with SMTP id u9pr35jhf2oneas40c351uu10bhk40tu8jt6ml81 for support@mail.flexihire.link; Mon, 27 Apr 2026 10:23:13 +0000 (UTC)\",\"by mail-wr1-f52.google.com with SMTP id ffacd0b85a97d-43d73352cf2so8443686f8f.1 for <support@mail.flexihire.link>; Mon, 27 Apr 2026 03:23:12 -0700 (PDT)\"]",
    "x-ses-spam-verdict": "PASS",
    "x-ses-virus-verdict": "PASS",
    "received-spf": "pass (spfCheck: domain of _spf.google.com designates 209.85.221.52 as permitted sender) client-ip=209.85.221.52; envelope-from=despacitoqwerty123@gmail.com; helo=mail-wr1-f52.google.com;",
    "authentication-results": "amazonses.com; spf=pass (spfCheck: domain of _spf.google.com designates 209.85.221.52 as permitted sender) client-ip=209.85.221.52; envelope-from=despacitoqwerty123@gmail.com; helo=mail-wr1-f52.google.com; dkim=pass header.i=@gmail.com; dmarc=pass header.from=gmail.com;",
    "x-ses-receipt": "AEFBQUFBQUFBQUFHWjRLcTdWdFVDQ2tRL2FhZWQwRFF5ODRzL3JYRFVrMXhUdE9ySXZpbk9odk02c0NORU56UGZlSmZGMEhsWmphQi9ycUpoWXdSV1k3SUlYUDZHazF2ZUNHaFd6NU9rSXNOWTRuUTAvUEI0MCtpZHVKY0NpZ3BIUjV4OGdtLzE5MVJJdWdsUllydWdycUlrR0NOdVhGTmY0aXRYY2ZVTGwwQmpDYmVDM3RFMFBzUG8rc3IzU3E5cEU0OXR2NjAxN2hUQmIxcTJ5L3dkbVdZTlQrenVlMldCQ2QwVWM1MmJwUmx6RGkyeS83eFNVTGNqcjhIZHlCQzUwenRYVzk1VVhBREcyOEFXZ2JJbGlWbVlYdENORjNHQW9hd2RlUmZCdUpyWWtyeHR4R2FLRHc9PQ==",
    "x-ses-dkim-signature": "a=rsa-sha256; q=dns/txt; b=dePB8FoAPcUCKd1oWVyFHZ5rWdF0g57Ca8ljn/r9+ZHZi+hQznmP4ye/haJfKIB8uTf8ASJsNMDAl7Cnc0rRR7xYR/+lbim6Az3gyYkNJU0sD089ZHsRgAbz4OCBX7JSA8PzzKx3ViqqDJaNg5yni5IzZouDz8ahuyrjOaW/kh0=; c=relaxed/simple; s=suwteswkahkjx5z3rgaujjw4zqymtlt2; d=amazonses.com; t=1777285394; v=1; bh=lbO46hVtlWbxCeSishnezlLPDtQDDtZK1xkOLYxRHLM=; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;",
    "arc-seal": "i=1; a=rsa-sha256; t=1777285390; cv=none; d=google.com; s=arc-20240605; b=LoKUj7GMyevbVP0YYIta+TYwxDQMJ+pTcGjxAYnghJnnUMj6Rw/0JSgDTSx8E0cfvt i++LFjpnFg2MXnseKUcfutqjILP3ocXFmgmOXkms+fwPpfMDzlNHNJNs1eLjbx/GnnGe kYp4w9rUy2RRb5e7VJBfCG7x569vM+aEZE54PlwJdVIGTuVXGB+WLdZ4YeW1p4AkHY1u 4UUc0eDq0h9AQM0Nkja2NjS2SNr9q3pG2IYn9SB0GHkiRYs8tWTP0BEXK7erklCwWYqk eDhQTV+c8xmqt37POEpwKoIBsXxapc/YRBL2YK/nYX5i8Wc95bz4dUr4S5kDxDvb+u3D jEcw==",
    "arc-message-signature": "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605; h=to:subject:message-id:date:from:mime-version:dkim-signature; bh=lbO46hVtlWbxCeSishnezlLPDtQDDtZK1xkOLYxRHLM=; fh=xi18HhkhKiGu4kxUxKqvQ80kT7lFmLo017ftNUk/7p8=; b=G+3PJ+ro9I5YGV1NFVLlEXj5r0mB2HqHXnm8f0f273MvsU8ah2BQ+Zx1v8EYR04ZKL HcDvULA7e0t5xStkspVw5nnFNTV8grtMOVbqTHnts+AuUNBi/82i3stC2BKOdmoR/Nxn IqllCo05B6LLd2XCf1EMcKOZW9a0uQ+hhOikLmPPfqgNbvBCYrA9EsJJkH/Gxul2dB7a Mu9qBQbqpKD5JbD8PupkWCX5i69aP2v6pioPsMrJOz1Tv8VJwgBh5hWLFyFIOqp1zggk QvtM9vG449+MdWdosJpZdIo8lvJhm3PrhhObt+5pX6Vn69+33fhU3hkzU3kAcSH6fcyC uEeg==; darn=mail.flexihire.link",
    "arc-authentication-results": "i=1; mx.google.com; arc=none",
    "dkim-signature": "v=1",
    "x-google-dkim-signature": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20251104; t=1777285390; x=1777890190; h=to:subject:message-id:date:from:mime-version:x-gm-gg :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to; bh=lbO46hVtlWbxCeSishnezlLPDtQDDtZK1xkOLYxRHLM=; b=f2sN47oBTO97VSnWtLrdgvVCVYbfrM7sNKft/5QEJe2ahe5h80AyM2uD9NmYT/6bU9 vTibngiiX62chLkge4JGAJ0K3mAV7LO3Zwhbh070xmyYvavVQDFwCXmEOaqt0wiSMOrB ffFHmiFle2LFUOhDjq1k8uK/suwqtHMMbjK7vgJdv5/3ON+wnFtFNH+RANw/vNzWRiZz 5lCLDB8egyd/7vP3WhNNfvn+H7hqvZAwbOGm6iFt1/oyTWxhJCh8K+j03zZ7lXeV4DrF XQpJY7JyvEnIdM1qKE6KiUQT5mm8i1cbYVnUm160jtV0WElOw5e8cvLA0IxToLOXUSfN vyWg==",
    "x-gm-message-state": "AOJu0Yw+ITreSMkNsIt8Ze+yhHh3xymYXd7JlTknDAOS5Mx71ya3l0GI /0b2h7YcftRNiiUkFTaqlik4GEFgvzIwx+4FkTbOIJs3Nuijn0gPs0PtANT6RklKt1XlDERPUME cizR5QMctoNyiPEsQKkI8U1kS0NJteALf8A==",
    "x-gm-gg": "AeBDievzmU9vrciW9HdId+UzQyHUOk5MR/JzveBs7ZBI2fHMaCCQRrGa5FabgO4miWm vudUPWAtvXeeFlgVez1QlypgdJkDPCVC3lG0C7FzRAxKKV64B01sQ0t51m/CHTjXnV7PAykyh0K zPVwkpapTx/sx9PWMgWlo39Kpbh1GnNz+qPZhUSvsZrHUUlHpYQV8yJJf4Di4B/rLpmv1hTHBXp DUlwyb5CTVnHdI2tGblbjdmP2unh3o+8ufLUA8BDT98Hk/tI+z1HvWDOEBggns9tdz5QtSQCmba UyAPVBivlNNRmDL9JYg=",
    "x-received": "by 2002:a05:6000:420a:b0:43d:773d:78ff with SMTP id ffacd0b85a97d-43fe3e0b61bmr65530273f8f.27.1777285389493; Mon, 27 Apr 2026 03:23:09 -0700 (PDT)",
    "mime-version": "1.0",
    from: "\"hina kagiyama\" <despacitoqwerty123@gmail.com>",
    date: "\"2026-04-27T10:22:55.000Z\"",
    "x-gm-features": "AVHnY4J_StNMYOtFGkjaQRIW48ldUd9-a8SE3Mwj11AdQyVCsDM7z-siIVqAO4o",
    "message-id": "<CAFKw-cB-Z0=bhwwEhD2Nuxjoea-w3eKPdhw7FCDX78rzsgWz3A@mail.gmail.com>",
    subject: "testing again",
    to: "support@mail.flexihire.link",
    "content-type": "multipart/mixed",
  },
  raw: {
    download_url: "https://cdn.resend.app/receiving/raw/u9pr35jhf2oneas40c351uu10bhk40tu8jt6ml81?response-content-disposition=attachment%3B+filename%3D%22u9pr35jhf2oneas40c351uu10bhk40tu8jt6ml81%22&Expires=1777301183&Key-Pair-Id=K1EE1EYO2ZO8UR&Signature=2bOtIbFWnx2ocGxZhXPxwHlY6kMR1kel~opf8wvSUs3RKIerKFfgCY7msaqpxVgELORlav4ontL1XnGKAnO6u~5PrCHdXxbzyA5eSFlacSo47rFaDvdfGuj9aBUOWT9EA~kvg-de2CdcMbLnSbjOXSHjl~NPrYvGZ0VSiNNmT4DdipfVsIEdhLFrkbb~PYoIOBMse3bJ44kGNRB2g2eqUXLna9fbvFFmzPQVAsamsF02INHyLTE8peBo8ZW4uG5RZPI55jwiek404-M-8Jeo9oQlkWr0WZathFxJA4O0nDnmva71x8tbNhWHJA-KhVjZOPmtG-8FkAwnl-MWr6dHtg__",
    expires_at: "2026-04-27T14:46:22.762Z",
  },
  attachments: [
    {
      id: "7b7d74bc-6bf2-4b33-b6c8-0e218aee5982",
      filename: "HErWB3qXkAAAItB.jpg",
      content_type: "image/jpeg",
      content_id: "<f_moh1tlvz0>",
      content_disposition: "attachment",
      size: 24566,
    }
  ],
}

*/
      }
      return { success: true }
    } catch (error) {
      console.error('Invalid webhook signature:', error)
      set.status = 400
      return { error: 'Invalid signature' }
    }
  }, {
    parse: 'none'

  })
/*
  created_at: "2026-04-27T10:22:55.000Z",
  data: {
    attachments: [
      [Object ...]
    ],
    bcc: [],
    cc: [],
    created_at: "2026-04-27T10:23:15.273Z",
    email_id: "1b9012fb-cffa-45fb-a04d-b35ff52f5605",
    from: "despacitoqwerty123@gmail.com",
    message_id: "<CAFKw-cB-Z0=bhwwEhD2Nuxjoea-w3eKPdhw7FCDX78rzsgWz3A@mail.gmail.com>",
    subject: "testing again",
    to: [ "support@mail.flexihire.link" ],
  },
  type: "email.received",
*/