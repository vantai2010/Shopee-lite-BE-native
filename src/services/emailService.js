const nodemailer = require('nodemailer');
require('dotenv').config()


let sendEmailRegister = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Shopee lite" <chuvantai2002@gmail.com>',
        to: dataSend.reciverEmail,
        subject: dataSend.language === 'en' ? 'Account registration procedure' : 'Thủ tục đăng ký tài khoản',
        html: getBodyHTMLRegisterEmail(dataSend)
    })
}


let getBodyHTMLRegisterEmail = (dataSend) => {
    console.log(dataSend)
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào</h3>
        <p>Bạn nhận được email này vì bạn đã đăng ký tài khoản bên ứng dụng Shopee-lite của chúng tôi</p>
        <p>Bên dưới có một đường link để đấn đến thủ tục tiếp theo trong quá trình đăng ký tài khoản của chúng tôi bạn vui lòng vào và nhập đầy đủ thông tin cá nhân của bản thân.<p>
        <a href="${process.env.URI_FRONT_END}/${dataSend.accountId}/${dataSend.language}">click here</a>
        <div>Xin chân thành cảm ơn quý khách đã tin tưởng xử dụng dịch vụ của chúng tôi</div>
    `
    } else {
        result = `
        <h3>hello</h3>
        <p>You received this email because you signed up for an account with our Shopee-lite</p>
        <p>There is a link below to go to the next step in our account registration process. Please enter and fill in your personal information.<p>
        <a href="${process.env.URI_FRONT_END}/${dataSend.accountId}/${dataSend.language}">click here</a>
        <div>Thank you very much for trusting our service</div>
        `
    }

    return result
}

let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Công ty sức khỏe zephyous" <chuvantai2002@gmail.com>',
        to: dataSend.reciverEmail,
        subject: dataSend.language === 'en' ? 'Register for medical appointment' : 'Đăng ký đặt lịch khám bệnh',
        html: getBodyHtmlEmail(dataSend)

    })

}

let getBodyHtmlEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên trang web: booking-care.com</p>
        <p>Thông tin đặt lịch khám bệnh: <p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <div>lý do thăm khám là: ${dataSend.reason}</div>
        <p>Nếu các thông tin trên chính xác , vui lòng nhấn vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Chân thành cảm ơn quý khách đã sử dịch dịch vụ của chúng tôi</div>
    `
    } else {
        result = `<h3>hello ${dataSend.patientName}</h3>
        <p>You received this email because you booked an appointment on the website: booking-care.com</p>
        <p>Medical appointment booking information: <p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <div>reason for visit is: ${dataSend.reason}</div>
        <p>If the above information is correct, please click on the link below to complete the procedure to book an appointment</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Thank you very much for using our service</div>
        `
    }

    return result
}

let getBodyHTMLEmailResetPassword = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào</h3>
        <p>Bạn nhận được email này vì bạn có nhu cầu lấy lại mật khẩu</p>
        <p>Bạn vui lòng nhấn vào link bên dưới để đặt lại mật khẩu của mình<p>
        <div>Xin chân thành cảm ơn quý khách đã tin tưởng xử dụng dịch vụ của chúng tôi</div>
        <a href="${dataSend}">click here</a>
    `
    } else {
        result = `
        <h3>hello</h3>
         <p>You received this email because you need to reset your password</p>
         <p>Please click the link below to reset your password<p>
         <div>Thank you very much for trusting our service</div>
         <a href="${dataSend}">click here</a>
        `
    }

    return result
}


let getBodyHTMLEmailForgotPassword = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>xin chào</h3>
        <p>Bạn nhận được email này vì bạn có nhu cầu lấy lại mật khẩu</p>
        <p>Bạn vui lòng nhấn vào link bên dưới để đặt lại mật khẩu của mình<p>
        <a href="${process.env.URL_FRONT_END}/auth/forgot-password/${dataSend.reciverEmail}/${dataSend.phoneNumber}/${dataSend.language}">click here</a>
        <div>Xin chân thành cảm ơn quý khách đã tin tưởng xử dụng dịch vụ của chúng tôi</div>
    `
    } else {
        result = `
        <h3>hello</h3>
         <p>You received this email because you need to reset your password</p>
         <p>Please click the link below to reset your password<p>
         <a href="${process.env.URL_FRONT_END}/auth/forgot-password/${dataSend.reciverEmail}/${dataSend.phoneNumber}/${dataSend.language}">click here</a>
         <div>Thank you very much for trusting our service</div>
        `
    }

    return result
}


let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Công ty sức khỏe zephyous" <chuvantai2002@gmail.com>',
        to: dataSend.email,
        subject: dataSend.language === 'en' ? 'The Result of appointment appointment' : 'Kết quả đặt lịch khám bệnh',
        html: getBodyHtmlSendRemedyEmail(dataSend),
        attachments: [
            {
                filename: 'hoadon.png',
                content: dataSend.image.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    })
}

let sendEmailResetPassword = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Thư viện eagleClup" <chuvantai2002@gmail.com>',
        to: dataSend.reciverEmail,
        subject: dataSend.language === 'en' ? 'Reset Password' : 'Đặt lại mật khẩu',
        html: getBodyHTMLEmailResetPassword(dataSend)

    })
}



let sendEmailForgotPassword = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let infor = await transporter.sendMail({
        from: '"Thư viện eagleClup" <chuvantai2002@gmail.com>',
        to: dataSend.reciverEmail,
        subject: dataSend.language === 'en' ? 'Forgot Password' : 'Quên mật khẩu',
        html: getBodyHTMLEmailForgotPassword(dataSend)

    })
}

module.exports = {
    sendSimpleEmail,
    sendAttachment,
    sendEmailResetPassword,
    sendEmailRegister,
    sendEmailForgotPassword,
}