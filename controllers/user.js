const { user, interest, review } = require("../models");
const crypterUtil = require("../util/crypter");
const mailUtil = require("../util/mail");

module.exports = {
    login: async (req, res) => {
        const { user_id, password } = req.body;

        //db에서 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id, password:crypterUtil.encrypt(password), use_yn:'Y' }
        });

        if (!userInfo) {
            res.status(404).send("post login error");
        } else {
            //user_id session에 저장
            req.session.user_id = userInfo.user_id;

            //response에 user_id와 message를 담아 전송
            res.json({
                "user_id": req.session.user_id,
                "message": "success post login"
            });
        }
    },
    authLogin: async (req, res) => {
        const { auth_id } = req.body;

        //db에서 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id:auth_id, password:crypterUtil.encrypt(process.env.AUTH_LOGIN_PASSWORD+''+auth_id), use_yn:'Y' }
        });

        if (!userInfo) {
            res.status(404).send("post auth-login error");
        } else {
            //user_id session에 저장
            req.session.user_id = userInfo.user_id;

            //response에 user_id와 message를 담아 전송
            res.json({
                "user_id": req.session.user_id,
                "message": "success post auth-login"
            });
        }
    },
    logout: (req, res) => {
        //세션 해제
        req.session.destroy(function () {
            req.session;
        });
        res.send("success post logout");
    },
    checkLoginId: async (req, res) => {
        const user_id = req.body.user_id;

        //db에서 해당 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id, use_yn:'Y' }
        });
        
        res.json({"data":(userInfo)?'Y':'N'});
    },
    signup: async (req, res) => {
        const { user_id, password, nickname, email, genre } = req.body;

        //db에 user정보 저장
        const result = await user.create({
            user_id, password:crypterUtil.encrypt(password), nickname, email:crypterUtil.encrypt(email), genre,
            created_id: user_id, updated_id: user_id
        });
        if (!result) {
            res.status(500).send("post signup error");
        } else {
            res.send("success post signup");
        }
    },
    authSignup: async (req, res) => {
        const { auth_id, nickname, genre } = req.body;

        //db에 user정보 저장
        const result = await user.create({
            user_id:auth_id, password:crypterUtil.encrypt(process.env.AUTH_LOGIN_PASSWORD+''+auth_id), nickname, genre,
            created_id: auth_id, updated_id: auth_id
        });
        if (!result) {
            res.status(500).send("post auth-signup error");
        } else {
            res.send("success post auth-signup");
        }
    },
    findId: async (req, res) => {
        const email = req.body.email;

        //db에서 이메일로 user정보 조회
        const userInfo = await user.findOne({
            where: { email:crypterUtil.encrypt(email), use_yn:'Y' }
        });

        if (!userInfo) {
            res.status(404).send("post find-id error");
        } else {
            res.json({
                data: userInfo.user_id,
                message: "success post find-id"
            });
        }
    },
    findPassword: async (req, res) => {
        const { user_id, email } = req.body;

        //db에서 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id, email:crypterUtil.encrypt(email), use_yn:'Y' }
        });
        if (!userInfo) {
            res.status(404).send("post find-password error");
        } else {
            //메일 전송
            let toInfo = `${userInfo.nickname}<${crypterUtil.decrypt(userInfo.email)}>`;
            let subject = "비밀번호 안내입니다";
            let contents = `<div><span>비밀번호는 <b>${crypterUtil.decrypt(userInfo.password)}</b> 입니다.</span></div>`;
            const result = await mailUtil.sendMail(toInfo, subject, contents);
            if (!result) {
                res.status(500).send("post find-password sendMail error");
            } else {
                res.send("success post find-password");
            }
        }
    },
    info: async (req, res) => {
        //db에서 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id: req.session.user_id, use_yn:'Y' }
        });

        if (!userInfo) {
            res.status(404).send("get info error");
        } else {
            const { nickname, email, genre } = userInfo;

            res.json({ nickname, email:crypterUtil.decrypt(email), genre });
        }
    },
    edit: async (req, res) => {
        const { nickname, genre } = req.body;
        let { password, email } = req.body;
        if(password) password = crypterUtil.encrypt(password);
        if(email) email = crypterUtil.encrypt(email);
        
        //db의 user정보 수정
        const result = await user.update({password, nickname, email, genre},
        {
                where: { user_id: req.session.user_id }
            });

        if (!result || result.includes(0)) {
            res.status(500).send("put edit error");
        } else {
            res.send("success put edit");
        }
    },
    withdrawal: async (req, res) => {
        const user_id = req.session.user_id;
        let result = null;
        
        //db의 user정보 use_yn을 N으로 update (===삭제)
        result = await user.update({ use_yn: "N" },
            {
                where: { user_id }
            });
        
        //db의 interest정보 use_yn을 N으로 update (===삭제)
        result = await interest.update({ use_yn: "N" },
            {
                where: { user_id }
            });

        //db의 review정보 use_yn을 N으로 update (===삭제)
        result = await review.update({ use_yn: "N" },
            {
                where: { user_id }
            });

        //세션 해제
        req.session.destroy(function () {
            req.session;
        });
        
        res.send("success delete withdrawal");
    }
};
