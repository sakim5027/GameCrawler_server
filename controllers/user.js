const { user } = require("../models");
module.exports = {
  login: async (req, res) => {
    const { user_id, password } = req.body;

    //db에서 user정보 조회
    const userInfo = await user.findOne({
      where: { user_id, password }
    });

    if (!userInfo) {
      res.status(500).send("post login error");
    } else {
      //user_id session에 저장
      req.session.user_id = userInfo.user_id;
      
      //response에 user_id와 message를 담아 전송
      res.json({    
        "user_id" : req.session.user_id,
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
  signup: async(req, res) => {
    const { user_id, password, nickname, email, genre } = req.body;

    //db에 user정보 저장
    const userInfo = await user.create({
        user_id, password, nickname, email, genre,
        created_id:user_id, updated_id:user_id
    });
    if (!userInfo) {
      res.status(500).send("post signup error");
    } else {
      res.send("success post signup");
    }
  }
};
