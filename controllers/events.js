const { DB, CHECK_IF_ACTOR_EXIST, INSERT_ACTOR_SQL, INSERT_EVENT_SQL, INSERT_REPO_SQL } = require('../db/dbQuery')

const successMessage = { status: true, message: 'Request was processed successful' };
const errorMessage = { status: false, error: '', message: 'An error occurred while processing your request!' };

var getAllEvents = (req, res) => {

};
var addEvent = (req, res) => {
    try {
        const { id, type, created_at, actor, repo } = req.body;
        const CHECK_ACTOR_SQL = CHECK_IF_ACTOR_EXIST(id);

        DB.get(CHECK_ACTOR_SQL, (error, { count }) => {
            if (error) throw new Error(error)
            if (count > 0) {
                errorMessage.message = "Event already exists in the database"
                return res.status(400).send(errorMessage)
            }

            DB.run(INSERT_ACTOR_SQL, [actor.id, actor.login, actor.avatar_url])
                .run(INSERT_REPO_SQL, [repo.id, repo.name, repo.url, actor.id])
                .run(INSERT_EVENT_SQL, [id, type, created_at, actor.id, repo.id])

            if (error) {
                errorMessage.message = error.message;
                return res.status(400).send(errorMessage)
            }

            successMessage.data = null;
            successMessage.message = "Event Added Succefully to the database";
            res.status(201).send(successMessage)
        })

    } catch (error) {
        res.status(500).send(error);
    }
};


var getByActor = () => {

};


var eraseEvents = () => {

};

module.exports = {
    getAllEvents: getAllEvents,
    addEvent: addEvent,
    getByActor: getByActor,
    eraseEvents: eraseEvents
};