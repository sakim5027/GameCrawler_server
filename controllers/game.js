const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { game, genre, interest } = require("../models");

module.exports = {
    list: async (req, res) => {
        let { flag } = req.query
        let { game_name, genre_id } = req.body;
        let gameList = null;

        if (flag && flag === "new") { //최신게임 목록 조회
            //db에서 게임목록 조회
            gameList = await game.findAll({
                attributes: [
                    ['id', 'game_id'], ['name', 'game_name'], ['cover_image_url', 'game_image'],
                    [
                        // Note the wrapping parentheses in the call below!
                        Sequelize.literal(`(
                            SELECT IF(COUNT(*)>0,'Y','N')
                            FROM interests AS i
                            WHERE
                                i.game_id = game.id
                                AND i.user_id = '${req.session.user_id}'
                                AND i.use_yn = 'Y'
                        )`),
                        'interest_yn'
                    ], //사용자가 해당 게임에 관심있는지 여부
                    'createdAt'
                ],
                include: [{
                    model: genre,
                    required: true, //true는 inner join, false는 Left outer join
                }],
                order: [['createdAt', 'DESC']],
                limit:10
            });
        } else {
            //genre
            let genreObj = {
                model: genre,
                required: true, //true는 inner join, false는 Left outer join
            };
            //genre_id가 있는 경우 where절 추가
            if (genre_id) {
                genreObj.where = { '$genres.id$': { [Op.eq]: genre_id } }
            }

            //db에서 게임목록 조회
            gameList = await game.findAll({
                attributes: [
                    ['id', 'game_id'], ['name', 'game_name'], ['cover_image_url', 'game_image'],
                    [
                        // Note the wrapping parentheses in the call below!
                        Sequelize.literal(`(
                            SELECT IF(COUNT(*)>0,'Y','N')
                            FROM interests AS i
                            WHERE
                                i.game_id = game.id
                                AND i.user_id = '${req.session.user_id}'
                                AND i.use_yn = 'Y'
                        )`),
                        'interest_yn'
                    ] //사용자가 해당 게임에 관심있는지 여부
                ],
                include: [genreObj],
                where: (Sequelize.fn('lower', Sequelize.col('name')), (game_name) ? {
                    name: { [Op.like]: `%${game_name}%` }
                } : '')
            });
        }

        if (gameList.length === 0) {
            res.status(404).send("get games error");
        } else {
            const dataArray = [];
            for (let i = 0; i < gameList.length; i++) {
                const { game_id, game_name, game_image, genres, interest_yn } = gameList[i].dataValues;

                dataArray.push({
                    game_id, game_name, game_image,
                    genre: genres.map(genre => genre.name).join(', '),
                    interest_yn
                })
            }
            res.json({ data: dataArray });
        }
    },
    info: async (req, res) => {
        const { game_id } = req.query;

        //db에서 게임정보 조회
        const gameInfo = await game.findOne({
            attributes: ['id', 'name', 'platforms_name', 'involved_companies_name', 'age_ratings',
                'cover_image_url'],
            attributes: {
                include: [
                    [Sequelize.fn('date_format', Sequelize.col('first_release_date'), '%Y-%m-%d'), 'first_release_date'], //게임 출시일
                    [
                        // Note the wrapping parentheses in the call below!
                        Sequelize.literal(`(
                            SELECT IF(COUNT(*)>0,'Y','N')
                            FROM interests AS i
                            WHERE
                                i.game_id = game.id
                                AND i.user_id = '${req.session.user_id}'
                                AND i.use_yn = 'Y'
                        )`),
                        'interest_yn'
                    ] //사용자가 해당 게임에 관심있는지 여부
                ]
            },
            include: [
                {
                    model: genre,
                    required: true, //true는 inner join, false는 Left outer join
                    attributes: ['name']
                }
            ],
            where: { id: game_id }
        });

        if (!gameInfo) {
            res.status(404).send("get game error");
        } else {
            const { id, name, platforms_name, involved_companies_name, age_ratings, cover_image_url } = gameInfo;
            const genre = gameInfo.genres.map(genre => genre.name).join(', ');

            res.json({ data: { game_id: id, game_name: name, platforms_name, involved_companies_name, age_ratings, first_release_date: gameInfo.dataValues.first_release_date, game_image: cover_image_url, genre, interest_yn: gameInfo.dataValues.interest_yn } });
        }
    }
};
