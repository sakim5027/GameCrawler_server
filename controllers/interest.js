const { interest } = require("../models");

module.exports = {
    regist: async (req, res) => {
        const { game_id } = req.body;

        //db에 interest정보 저장
        const result = await interest.create({
            game_id,
            user_id: req.session.user_id
        });
        if (!result) {
            res.status(500).send("post interest error");
        } else {
            res.send("success post interest");
        }
    },
    delete: async (req, res) => {
        const id = req.params.interest_id;

        //db의 interest정보 use_yn을 N으로 update (===삭제)
        const result = await interest.update({ use_yn: "N" }, {
            where: {
                id
            }
        });

        if (!result) {
            res.status(500).send("delete interest error");
        } else {
            res.send("success delete interest");
        }
    }
};
