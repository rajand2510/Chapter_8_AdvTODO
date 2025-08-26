const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'rajandalvadi2510@gmail.com',
    pass: 'kjpfpefyexkkwuez',
  },
});

async function sendEmail(to, subject, task) {
  try {
    const appUrl = process.env.APP_BASE_URL;

    await transporter.sendMail({
      from: 'rajandalvadi2510@gmail.com',
      to,
      subject,
      html: `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8"> 
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Task Reminder</title>

    <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->

    <style>
      /* Base reset for email */
      html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
      * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
      table, td { mso-table-lspace:0pt !important; mso-table-rspace:0pt !important; }
      table { border-collapse:collapse !important; }
      img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
      a { text-decoration:none; }

      /* Container */
      .wrapper { width:100%; background:#0b0e13; background-image: linear-gradient(180deg,#0b0e13 0%, #121826 100%); }
      .spacer-24 { line-height:24px; font-size:24px; }
      .spacer-16 { line-height:16px; font-size:16px; }

      /* Card */
      .card { width:100%; max-width:600px; margin:0 auto; background: #0f1624; border-radius:16px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); overflow:hidden; border:1px solid rgba(255,255,255,0.06); }
      .inner { padding: 28px; }

      /* Header */
      .header { background: radial-gradient(1200px 400px at 50% -200px, rgba(88,101,242,0.35), rgba(0,0,0,0)); padding: 28px; border-bottom: 1px solid rgba(255,255,255,0.07); }
      .brand { display:flex; flex-direction:column; align-items:center; gap:12px; }
      .brand-title { font: 600 18px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Helvetica Neue', Helvetica, Ubuntu, 'Noto Sans', sans-serif; color:#ffffff; letter-spacing:0.2px; }

      /* Typography */
      .h1 { margin:0; font: 700 22px/1.25 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Helvetica Neue', Helvetica, Ubuntu, 'Noto Sans', sans-serif; color:#ffffff; }
      .body { margin:0; font: 400 15px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Helvetica Neue', Helvetica, Ubuntu, 'Noto Sans', sans-serif; color:#cbd5e1; }
      .muted { color:#94a3b8; }
      .label { font:600 12px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Helvetica Neue', Helvetica, Ubuntu, 'Noto Sans', sans-serif; color:#a5b4fc; letter-spacing:0.6px; text-transform:uppercase; }

      /* Button */
      .btn { display:inline-block; background:#6366f1; color:#ffffff !important; padding:14px 20px; border-radius:12px; font:600 15px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Helvetica Neue', Helvetica, Ubuntu, 'Noto Sans', sans-serif; text-align:center; box-shadow:0 8px 18px rgba(99,102,241,0.35); }
      .btn:hover { filter: brightness(1.05); }

      /* Info row */
      .info { background: rgba(148,163,184,0.06); border:1px solid rgba(148,163,184,0.18); border-radius:12px; padding:12px 14px; }
      .info td { vertical-align:top; }

      /* Footer */
      .footer { width:100%; max-width:600px; margin:0 auto; padding:22px; color:#94a3b8; font: 400 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Helvetica Neue', Helvetica, Ubuntu, 'Noto Sans', sans-serif; }

      /* Dark-mode aware (many clients support this) */
      @media (prefers-color-scheme: light) {
        .wrapper { background:#f3f4f6; }
        .card { background:#ffffff; border-color: #e5e7eb; }
        .header { background: radial-gradient(1200px 400px at 50% -200px, rgba(99,102,241,0.12), rgba(0,0,0,0)); border-bottom-color:#eef2ff; }
        .h1 { color:#0f172a; }
        .body { color:#334155; }
        .muted { color:#64748b; }
        .label { color:#4f46e5; }
        .footer { color:#64748b; }
        .info { background:#f8fafc; border-color:#e2e8f0; }
        .btn { box-shadow:none; }
      }

      /* Mobile */
      @media screen and (max-width: 620px) {
        .inner, .header { padding:20px !important; }
        .h1 { font-size:20px !important; }
      }
    </style>
  </head>

  <body class="wrapper" style="padding:24px;">

    <!-- Preheader (hidden in most clients) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
      Reminder: ${task.text} — due ${task.date ? new Date(task.date).toLocaleString() : 'No date set'}
    </div>

    <!-- Card -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" class="card" cellpadding="0" cellspacing="0">

            <!-- Header / Brand -->
            <tr>
              <td class="header">
                <table role="presentation" width="100%">
                  <tr>
                    <td>
                      <div class="brand">
                        <!-- Logo -->
                        <img src="https://i.ibb.co/ynhnX8ft/Chat-GPT-Image-Aug-21-2025-04-58-26-PM.png"  height="40"   alt="DoSphere logo" style="border-radius:12px;">

                      </div>
                    </td>
                 
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="inner">
                                      <div class="brand-title">Task Reminder</div>
                <p class="label" style="margin:0 0 6px;">Heads up</p>
                <h1 class="h1" style="margin:0 0 12px;">You have a task due soon</h1>
                   <h4  style="font: 600 12px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial; color:#a5b4fc;">${new Date().toLocaleDateString()}</h4>
                <p class="body" style="margin:0 0 18px;">
                  Hi,<br/> This is a friendly reminder for your task:
                </p>
                <table role="presentation" width="100%" class="info" cellpadding="0" cellspacing="0" style="margin: 14px 0 18px;">
                  <tr>
                    <td width="36" style="padding-right:10px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/942/942751.png" alt="Task" width="28" height="28" style="opacity:0.9;">
                    </td>
                    <td>
                      <div class="body" style="font-weight:600; color:#e5e7eb;">${task.text}</div>
                      <div class="muted" style="margin-top:4px;">
                        Due: ${task.date ? new Date(task.date).toLocaleString() : 'No date set'}
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 6px 0 4px;">
                  <tr>
                    <td align="left">
                      <a class="btn" href="${appUrl}/tasks/${task._id}" target="_blank">👉 View Task</a>
                    </td>
                  </tr>
                </table>

                <!-- Secondary CTA / Safe link -->
                <p class="muted" style="margin:12px 0 0; font-size:12px;">
                  If the button doesn’t work, copy and paste this link into your browser:<br>
                  <a href="${appUrl}/tasks/${task._id}" style="color:#a5b4fc; word-break:break-all;">${appUrl}/tasks/${task._id}</a>
                </p>

                <div class="spacer-16">&zwnj;</div>

                <p class="muted" style="margin:0; font-size:12px;">
                  You’re receiving this because you enabled reminders in DoSphere.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <div class="footer">
      <div style="text-align:center;">
        © ${new Date().getFullYear()} DoSphere · <a href="${appUrl}/settings/notifications" style="color:#a5b4fc;">Notification settings</a>
      </div>
    </div>

    <!--[if mso]>
      <style>
        .btn { background:#6366f1 !important; }
      </style>
    <![endif]-->
  </body>
</html>`,
    });

    console.log("📧 Email sent:", to);
    console.log("📧 Email content:", {
      subject,
      html: `
        <p>Hi,</p>
        <p>This is a reminder for your task:</p>
        <b>${task.text}</b><br/>
        <p>Due: ${task.date ? new Date(task.date).toLocaleString() : "No date set"}</p>
        <p><a href="${appUrl}/tasks/${task._id}">👉 View Task</a></p>
      `,
    });

  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
}

module.exports = { sendEmail };
