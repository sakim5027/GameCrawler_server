const Sequelize = require('sequelize');

const { game, genre, interest } = require("../models");

module.exports = {
    info: async (req, res) => {
        const { game_id } = req.query;

        //db에서 게임정보 조회
        const gameInfo = await game.findOne({
            attributes: ['id', 'name','platforms_name','involved_companies_name','age_ratings',
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
            const { id, name, platforms_name, involved_companies_name, age_ratings, cover_image_url} = gameInfo;
            const genre = gameInfo.genres.map(genre=>genre.name).join(', ');
            
            res.json({ data: { game_id:id, game_name:name, platforms_name, involved_companies_name, age_ratings, first_release_date:gameInfo.dataValues.first_release_date, game_image:cover_image_url, genre, interest_yn:gameInfo.dataValues.interest_yn } });
        }
    }
};
