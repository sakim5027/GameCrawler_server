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
};
