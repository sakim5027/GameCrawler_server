const { review } = require("../models");

module.exports = {
    regist: async (req, res) => {
        const { game_id, rate, story, graphic, hardness, music, ux, contents } = req.body;

        //db에 review정보 저장
        const result = await review.create({
            game_id, rate, story, graphic, hardness, music, ux, contents,
            user_id: req.session.user_id
        });
        if (!result) {
            res.status(500).send("post review error");
        } else {
            res.send("success post review");
        }
    },
    info: async (req, res) => {
        const { review_id } = req.params;

        //db에서 리뷰정보 조회
        const reviewInfo = await review.findOne({
            where: { id:review_id }
        });

        if (!reviewInfo) {
            res.status(404).send("get review error");
        } else {
            const { rate, story, graphic, hardness, music, ux, contents } = reviewInfo;

            res.json({ rate, story, graphic, hardness, music, ux, contents });
        }
    },
    modify: async (req, res) => {
        const { review_id, rate, story, graphic, hardness, music, ux, contents } = req.body;

        //db의 review정보 수정
        const result = await review.update({ rate, story, graphic, hardness, music, ux, contents },
            {
                where: { id: review_id }
            });

        if (!result) {
            res.status(500).send("put review error");
        } else {
            res.send("success put review");
        }
    },
    delete: async (req, res) => {
        const id = req.body.review_id;

        //db의 review정보 삭제
        const result = await review.destroy({
            where: {
                id
            }
        });

        if (!result) {
            res.status(500).send("delete review error");
        } else {
            res.send("success delete review");
        }
    }
};
