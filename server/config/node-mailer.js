import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use Gmail as the email service
    host: 'smtp.gmail.com', // SMTP server address for Gmail
    port: 465, // Port number for secure connections (TLS/SSL)
    secure: true, // Use SSL (true for port 465)
    auth:{
        user: process.env.SMTP_USER ,
        pass: process.env.SMTP_PASS ,
    }
})

export default transporter;