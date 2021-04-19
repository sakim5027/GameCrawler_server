const { review } = require("../models");
module.exports = {
    addReview: async (req, res) => {
        const { game_id, rate, story, graphic, hardness, music, ux, contents } = req.body;

        //db에 review정보 저장
        const result = await review.create({
            game_id, rate, story, graphic, hardness, music, ux, contents,
            user_id:req.session.user_id
        });
        if (!result) {
            res.status(500).send("post review error");
        } else {
            res.send("success post review");
        }
    },
    modifyReview: async (req, res) => {
        const { review_id, rate, story, graphic, hardness, music, ux, contents } = req.body;

        //db의 review정보 수정
        const result = await review.update({ rate, story, graphic, hardness, music, ux, contents },
            {
                where: { id:review_id }
            });

        if (!result) {
            res.status(500).send("put review error");
        } else {
            res.send("success put review");
        }
    }
};
