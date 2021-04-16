const { review } = require("../models");
module.exports = {
    addReview: async (req, res) => {
        const { game_id, rate, story, graphic, hardness, music, ux, contents } = req.body;

        //db에 user정보 저장
        const result = await review.create({
            game_id, rate, story, graphic, hardness, music, ux, contents,
            // user_id:req.session.user_id
            user_id:"kim"
        });
        if (!result) {
            res.status(500).send("post review error");
        } else {
            res.send("success post review");
        }
    }
};
