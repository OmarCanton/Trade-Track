require('dotenv').config()
const nodemailer = require('nodemailer')

const sendMails = async (user, res, randomCode) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'campusgadgetshub@gmail.com',
            pass: process.env.PASS
        }
    })

    const message = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            }
            .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            }
            .header {
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 5px 5px 0 0;
            }
            .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 0 0 5px 5px;
            }
            .otp-code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            color: #4CAF50;
            }
            .footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #777;
            }
        </style>
        </head>
        <body>
        <table class="email-container" cellpadding="0" cellspacing="0" border="0">
            <tr>
            <td class="header">
                <h2>Your Verification Code</h2>
            </td>
            </tr>
            <tr>
            <td class="content">
                <p>Hello,</p>
                <p>Thank you for signing up. Here is your One-Time Password (OTP) for verification:</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center">
                    <div class="otp-code">${randomCode}</div>
                    </td>
                </tr>
                </table>
                
                <p>This code will expire in 5 minutes. Please do not share this code with anyone.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </td>
            </tr>
            <tr>
            <td class="footer">
                <p>&copy; ${new Date().getFullYear()} | Campus Gadgets Hub. All rights reserved.</p>
            </td>
            </tr>
        </table>
        </body>
        </html>
    `
    try {
        const mailSent = await transporter.sendMail({
            to: user.email,
            subject: 'Verify Your Account',
            html: message
        })
        if(mailSent) {
            res.status(201).json({id: user._id , message: 'Verification link has been sent to your email, kindly check your inbox, or spam to complete the signup process'})
        } else {
            res.status(401).json({message: 'An error occured sending verification code, please try again later'})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

module.exports = sendMails