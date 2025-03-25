// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: process.env.EMAIL_SECURE === 'true',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// const sendVerificationEmail = async (email, verificationToken) => {
//     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
//     await transporter.sendMail({
//         from: `"SmartHome" <${process.env.EMAIL_FROM}>`,
//         to: email,
//         subject: 'Verify Your Email Address',
//         html: `
//             <p>Welcome to SmartHome! Please verify your email address to complete your registration.</p>
//             <p><a href="${verificationUrl}">Click here to verify your email</a></p>
//             <p>Or copy this link: ${verificationUrl}</p>
//         `
//     });
// };

// export { sendVerificationEmail };