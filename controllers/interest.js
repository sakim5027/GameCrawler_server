const { interest } = require("../models");

module.exports = {
    count: async (req, res) => {
        const { game_id } = req.query;
        let interestCount = null;

        //db에서 관심카운트 조회
        if (game_id) {
            interestCount = await interest.findAndCountAll({
                where: { game_id }
            });
        } else {
            interestCount = await interest.findAndCountAll({
                where: { user_id: req.session.user_id }
            });
        }

        if (interestCount.count === 0) {
            res.status(404).send("get count-interest error");
        } else {
            const { count } = interestCount;

            res.json({ data: count });
        }
    },
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
