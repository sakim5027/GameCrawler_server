const cron = require('node-cron');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { game, genre, game_genre } = require("../models");

const server = "https://api.igdb.com/v4";

//게임 정보 batch
const gameBatch = cron.schedule('0 5 * * *', () => {
    console.log("start gameBatch");

    axios.post(`${server}/games`,
        `fields name, genres.*, platforms.name, involved_companies.company, age_ratings.*, first_release_date, cover.url;
    where name != null & genres != null & platforms != null & involved_companies != null & age_ratings != null & first_release_date != null & cover != null;
    sort created_at desc; 
    limit 10;`
        , {
            headers: {
                "Client-ID": process.env.IGDB_CLIENT_ID,
                "Authorization": process.env.IGDB_AUTHORIZATION
            }
        })
        .then(response => {
            return response.data;
        })
        .then(data => {
            addGameData(data);
        })
        .catch(response => { console.error(response) });
});

//연령등급 분류
const age_ratings_caregory = {
    "1": "ESRB",
    "2": "PEGI"
};

//연령등급 연령
const age_ratings_rating = {
    "1": "Three",
    "2": "Seven",
    "3": "Twelve",
    "4": "Sixteen",
    "5": "Eighteen",
    "6": "RP",
    "7": "EC",
    "8": "E",
    "9": "E10",
    "10": "T",
    "11": "M",
    "12": "AO"
};

//게임제작사명 셋팅
const setInvolvedCompaniesName = async (idArray) => {
    let involvedCompaniesName = ""; //제작사명

    for (let i = 0; i < idArray.length; i++) {
        //제작사명 api서버 조회
        await axios.post(`${server}/companies`,
            `fields name;
        where id = ${idArray[i]};`
            , {
                headers: {
                    "Client-ID": process.env.IGDB_CLIENT_ID,
                    "Authorization": process.env.IGDB_AUTHORIZATION
                }
            })
            .then(response => {
                return response.data;
            })
            .then(data => {
                involvedCompaniesName += data[0].name;
                if (i !== idArray.length - 1) involvedCompaniesName += ",";
            })
            .catch(response => { console.error(response) });
    }

    return involvedCompaniesName;
}

//게임정보 db insert
const addGameData = async (data) => {
    for (let i = 0; i < data.length; i++) {
        const { id, name, genres, platforms, involved_companies, age_ratings,
            first_release_date, cover } = data[i];

        // db 게임정보 조회
        const gameInfo = await game.findOne({
            where: { id }
        });

        if (gameInfo) break; //db에 게임정보가 있는 경우

        const platforms_name = platforms.map(platform => platform.name).join(', ');
        const involved_companies_name = await setInvolvedCompaniesName(involved_companies.map(involvedCompany => involvedCompany.company)); //게임제작사명 셋팅
        const age_ratings_value = age_ratings.map(age_rating => age_ratings_caregory[age_rating.category] + " " + age_ratings_rating[age_rating.rating]).join(', ');

        //db에 게임정보 insert
        await game.create({
            id, name, platforms_name, involved_companies_name,
            age_ratings: age_ratings_value,
            first_release_date,
            cover_image_url: `https:${cover.url}`
        });

        //db에 게임장르정보 insert
        for (let j = 0; j < genres.length; j++) {
            await game_genre.create({
                game_id: id,
                genre_id: genres[j].id
            })
        }
    }
};

//장르 정보 batch
const genreBatch = cron.schedule('0 5 * * *', () => {
    console.log("start genreBatch");

    axios.post(`${server}/genres`,
        `fields *;
    sort id desc;
    limit 100;`
        , {
            headers: {
                "Client-ID": process.env.IGDB_CLIENT_ID,
                "Authorization": process.env.IGDB_AUTHORIZATION
            }
        })
        .then(response => {
            return response.data;
        })
        .then(data => {
            addGenreData(data);
        })
        .catch(response => { console.error(response) });
});

//장르정보 db insert
const addGenreData = async (data) => {
    for (let i = 0; i < data.length; i++) {
        const { id, name } = data[i];

        // db 장르정보 조회
        const genreInfo = await genre.findOne({
            where: { id }
        });

        if (genreInfo) break; //db에 장르정보가 있는 경우

        //db에 장르정보 insert
        await genre.create({
            id, name
        });
    }
}

gameBatch.start();
// gameBatch.stop();
genreBatch.start();
// genreBatch.stop();