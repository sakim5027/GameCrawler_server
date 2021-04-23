const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { review, game } = require("../models");

module.exports = {
    list: async (req, res) => {
        let reviewList = null;
        const { game_name, user_id } = req.body;

        //db에서 리뷰목록정보 조회
        //게임명으로 조회할 경우
        if (game_name) {
            reviewList = await review.findAll({
                attributes: [['id', 'review_id'], 'rate', 'story', 'graphic', 'hardness', 'music', 'ux', 'contents', 'user_id'],
                include: [
                    {
                        model: game,
                        required: true, //true는 inner join, false는 Left outer join
                        attributes: [['id', 'game_id'], ['name', 'game_name'], ['cover_image_url', 'game_image']],
                        where: (Sequelize.fn('lower', Sequelize.col('name')),{
                            name: { [Op.like]: `%${game_name}%` }
                        })
                    }
                ]
            })

        //user_id로 조회할 경우
        } else if (user_id) {
            reviewList = await review.findAll({
                attributes: [['id', 'review_id'], 'rate', 'story', 'graphic', 'hardness', 'music', 'ux', 'contents', 'user_id'],
                include: [
                    {
                        model: game,
                        required: true, //true는 inner join, false는 Left outer join
                        attributes: [['id', 'game_id'], ['name', 'game_name'], ['cover_image_url', 'game_image']]
                    }
                ],
                where: { user_id }
            });
        }
        
        if (reviewList.length === 0) {
            res.status(404).send("get reviews error");
        } else {
            res.json({ data: { reviewList } });
        }
    },
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
        const { review_id } = req.query;

        //db에서 리뷰정보 조회
        const reviewInfo = await review.findOne({
            where: { id: review_id }
        });

        if (!reviewInfo) {
            res.status(404).send("get review error");
        } else {
            const { rate, story, graphic, hardness, music, ux, contents } = reviewInfo;

            res.json({ data: { rate, story, graphic, hardness, music, ux, contents } });
        }
    },
    modify: async (req, res) => {
        const { review_id, rate, story, graphic, hardness, music, ux, contents } = req.body;

        //db의 review정보 수정
        const result = await review.update({ rate, story, graphic, hardness, music, ux, contents },
            {
                where: { id: review_id }
            });

        if (!result || result.includes(0)) {
            res.status(500).send("put review error");
        } else {
            res.send("success put review");
        }
    },
    delete: async (req, res) => {
        const id = req.params.review_id;

        //db의 review정보 use_yn을 N으로 update (===삭제)
        const result = await review.update({use_yn:"N"},{
            where: {
                id
            }
        });

        if (!result || result.includes(0)) {
            res.status(500).send("delete review error");
        } else {
            res.send("success delete review");
        }
    }
};
