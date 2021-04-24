const Sequelize = require('sequelize');

const { interest, game, genre } = require("../models");

module.exports = {
    list: async (req, res) => {
        let dataArray = [];

        //db에서 관심목록에 대한 장르목록 조회
        let genreList = await genre.findAll({
            attributes: [
                ['id', 'genre_id'], ['name', 'genre_name']
            ],
            include: [{
                model: game,
                required: true, //true는 inner join, false는 Left outer join
                include: [{
                    model: interest,
                    required: true, //true는 inner join, false는 Left outer join
                    where: { user_id: req.session.user_id, use_yn:'Y' }
                }]
            }]
        });

        if (genreList.length === 0) {
            res.status(404).send("get interests error");
        }

        //genre_id, genre_name 파싱
        for (let i = 0; i < genreList.length; i++) {
            const { genre_id, genre_name } = genreList[i].dataValues;
            dataArray.push({ genre_id, genre_name })
        }

        let gameList = null;
        for (let i = 0; i < dataArray.length; i++) {
            dataArray[i].interest_games = []; //관심게임 목록
            dataArray[i].recommendation_games = []; //추천게임 목록

            //db에서 장르id로 관심목록에 대한 게임목록 조회
            gameList = await genre.findOne({
                include: [{
                    model: game,
                    required: true, //true는 inner join, false는 Left outer join
                    attributes: [
                        ['id', 'game_id'], ['name', 'game_name'], ['cover_image_url', 'game_image']
                    ],
                    include: [{
                        model: interest,
                        required: true, //true는 inner join, false는 Left outer join
                        where: { user_id: req.session.user_id }
                    },
                    {
                        model: genre,
                        required: true //true는 inner join, false는 Left outer join
                    }]
                }],
                where: { id: dataArray[i].genre_id }
            });

            //해당 장르id 게임목록 파싱
            for (let j = 0; j < gameList.dataValues.games.length; j++) {
                const { game_id, game_name, game_image, genres } = gameList.dataValues.games[j].dataValues;
                dataArray[i].interest_games.push({ game_id, game_name, game_image, genre: genres.map(genre => genre.name).join(', ') });
            }

            //db에서 장르id로 게임목록 조회
            gameList = await genre.findOne({
                include: [{
                    model: game,
                    required: true, //true는 inner join, false는 Left outer join
                    attributes: [
                        ['id', 'game_id'], ['name', 'game_name'], ['cover_image_url', 'game_image']
                    ],
                    include: [
                        {
                            model: genre,
                            required: true //true는 inner join, false는 Left outer join
                        }]
                }],
                where: { id: dataArray[i].genre_id }
            });

            //해당 장르id 게임목록 파싱
            let isExists = false;
            for (let j = 0; j < gameList.dataValues.games.length; j++) {
                const { game_id, game_name, game_image, genres } = gameList.dataValues.games[j].dataValues;
                for (let k = 0; k < dataArray[i].interest_games.length; k++) {
                    if (dataArray[i].interest_games[k].game_id === game_id) {
                        isExists = true;
                        break;
                    }
                }

                if (!isExists) {
                    dataArray[i].recommendation_games.push({ game_id, game_name, game_image, genre: genres.map(genre => genre.name).join(', ') });
                }
                isExists = false;
            }
        }

        res.json({ data: dataArray });
    },
    count: async (req, res) => {
        const { game_id } = req.query;
        let interestCount = null;

        //db에서 관심카운트 조회
        if (game_id) {
            interestCount = await interest.findAndCountAll({
                where: { game_id, use_yn:'Y' }
            });
        } else {
            interestCount = await interest.findAndCountAll({
                where: { user_id: req.session.user_id, use_yn:'Y' }
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

        if (!result || result.includes(0)) {
            res.status(500).send("delete interest error");
        } else {
            res.send("success delete interest");
        }
    }
};
