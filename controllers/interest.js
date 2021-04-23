const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
    }
};
