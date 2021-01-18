const dbQuery = require("../db/dbQuery");
const {
    DB,
    GET_ALL_ACTORS,
    UPDATE_ACTOR,
    GET_ACTORS_BY_STREAK
} = require("../db/dbQuery");

const successMessage = { status: true, message: 'Request was processed successful' };
const errorMessage = { status: false, error: '', message: 'An error occurred while processing your request!' };

var getAllActors = (req, res) => {
    try {
        DB.all(GET_ALL_ACTORS, (err, response) => {
            if (err) {
                res.send(400).send(errorMessage)
            }
            successMessage.data = response.map(actor => {
                delete actor.event_count
                delete actor.created_at
                return actor
            })
            res.status(200).send(successMessage)
        })
    } catch (error) {
        res.send(500).send(error)
    }
};

var updateActor = (req, res) => {
    try {
        const { avatar_url, id } = req.body;
        DB.run(UPDATE_ACTOR, [avatar_url, id], (error, response) => {
            if (error) {
                errorMessage.message = error
                res.send(400).send(errorMessage)
            }
            successMessage.message = "Actor Avatar updated succesfully"
            successMessage.data = null;
            res.status(200).send(successMessage)
        })

    } catch (error) {
        res.send(500).send(error)
    }
};

var getStreak = (req, res) => {
    try {
        DB.all(GET_ACTORS_BY_STREAK, (error, response) => {
            if (error) {
                errorMessage.message = error
                res.send(400).send(errorMessage)
            }
            successMessage.message = "Actor details retrieved successfully"
            successMessage.data = response.map(actor => {
                delete actor.streak;
                delete actor.create_at;
                return actor;
            })
            res.status(200).send(successMessage)
        })
    } catch (error) {
        res.status(500).send(error)
    }
};


module.exports = {
    updateActor: updateActor,
    getAllActors: getAllActors,
    getStreak: getStreak
};