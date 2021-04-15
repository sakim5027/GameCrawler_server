const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
    service: 'gmail',
    // host를 gmail로 설정
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.OAUTH_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

module.exports = {
    //메일전송
    sendMail: async (toInfo, subject, contents) => {
        let result = false;
        try {
            await transporter.sendMail({
                // 보내는 곳의 이름과, 메일 주소를 입력
                from: `"TheCralwers" <${process.env.OAUTH_USER}>`,
                // 받는 곳의 메일 주소를 입력
                to: toInfo,
                // 보내는 메일의 제목을 입력
                subject,
                // 보내는 메일의 내용을 입력
                // text: 일반 text로 작성된 내용
                // html: html로 작성된 내용
                html: contents,
            });
            console.log('메일을 성공적으로 발송했습니다.');
            result = !result;
        } catch (e) {
            console.log(e);
        }
        return result;
    }
}