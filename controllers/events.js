const { DB, CHECK_IF_ACTOR_EXIST, INSERT_ACTOR_SQL, INSERT_EVENT_SQL, INSERT_REPO_SQL, GET_EVENTS_BY_ACTOR } = require('../db/dbQuery')

const successMessage = { status: true, message: 'Request was processed successful' };
const errorMessage = { status: false, error: '', message: 'An error occurred while processing your request!' };

const eventmapper = (eventdata) => {
    eventdata.actor = {};
    eventdata.repo = {};
    eventdata.actor.id = eventdata.actor_id;
    eventdata.actor.login = eventdata.login;
    eventdata.actor.avatar_url = eventdata.avatar_url;
    eventdata.repo.id = eventdata.repo_id;
    eventdata.repo.name = eventdata.name;
    eventdata.repo.url = eventdata.url;
    delete eventdata.actor_id;
    delete eventdata.login;
    delete eventdata.avatar_url;
    delete eventdata.repo_id;
    delete eventdata.name;
    delete eventdata.url;
    delete eventdata.repo_id;
    return eventdata;
}

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


var getEventByActorID = (req, res) => {
    const { actorID } = req.params
    try {
        DB.all(GET_EVENTS_BY_ACTOR, [actorID], (error, response) => {
            if (error) throw new Error(error)
            if (!response) {
                errorMessage.message = "The actor have no event in the database";
                return res.status(400).send(errorMessage)
            }

            successMessage.data = response.map(eventmapper);
            successMessage.message = "Actor's Events retrieved successfully";
            res.status(201).send(successMessage)
        })
    } catch (error) {
        res.status(500).send(error);
    }
};


var eraseEvents = () => {

};

module.exports = {
    getAllEvents: getAllEvents,
    addEvent: addEvent,
    getByActor: getEventByActorID,
    eraseEvents: eraseEvents
};