const { user } = require("../models");
module.exports = {
    login: async (req, res) => {
        const { user_id, password } = req.body;

        //db에서 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id, password }
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
    logout: (req, res) => {
        //세션 해제
        req.session.destroy(function () {
            req.session;
        });
        res.status(200).send("success post logout");
    },
    checkLoginId: async (req, res) => {
        const user_id = req.body.user_id;

        //db에서 해당 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id }
        });
        if (!userInfo) {
            res.status(404).send("post check-login-id error");
        } else {
            res.send("success post check-login-id");
        }
    },
    signup: async (req, res) => {
        const { user_id, password, nickname, email, genre } = req.body;

        //db에 user정보 저장
        const result = await user.create({
            user_id, password, nickname, email, genre,
            created_id: user_id, updated_id: user_id
        });
        if (!result) {
            res.status(500).send("post signup error");
        } else {
            res.send("success post signup");
        }
    },
    findId: async (req, res) => {
        const email = req.body.email;
        
        //db에서 이메일로 user정보 조회
        const userInfo = await user.findOne({
            where: { email }
        });

        if (!userInfo) {
            res.status(404).send("post find-id error");
        } else {
            res.json({    
                data : userInfo.user_id,    
                message: "success post find-id"
           });
        }
    },
    info: async (req, res) => {
        //db에서 user정보 조회
        const userInfo = await user.findOne({
            where: { user_id: req.session.user_id }
        });

        const { password, nickname, email, genre } = userInfo;
        if (!userInfo) {
            res.status(404).send("get info error");
        } else {
            res.json({ password, nickname, email, genre });
        }
    },
    edit: async (req, res) => {
        const { password, nickname, email, genre } = req.body;

        //db의 user정보 수정
        const result = await user.update({ password, nickname, email, genre },
            {
                where: { user_id: req.session.user_id }
            });

        if (!result) {
            res.status(500).send("put edit error");
        } else {
            res.send("success put edit");
        }
    }
};
