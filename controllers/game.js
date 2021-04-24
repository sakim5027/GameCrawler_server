const { game } = require("../models");

module.exports = {
    info: async (req, res) => {
        const { game_id } = req.query;

        //db에서 게임정보 조회
        const gameInfo = await game.findOne({
            include: [
                {
                    model: genre,
                    required: true, //true는 inner join, false는 Left outer join
                    attributes: [['name', 'genre']]
                }
            ],
            where: { id: game_id }
        });

        if (!gameInfo) {
            res.status(404).send("get review error");
        } else {
            const { rate, story, graphic, hardness, music, ux, contents } = reviewInfo;

            res.json({ data: { rate, story, graphic, hardness, music, ux, contents } });
        }
    }
};
