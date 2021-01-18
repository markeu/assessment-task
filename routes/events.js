var express = require('express');
var router = express.Router();
const { addEvent, getAllEvents, getEventByActorID } = require('../controllers/events');

// Routes related to event
router.post('/', addEvent);
router.get('/', getAllEvents);
router.get('/actors/:actorID', getEventByActorID);


module.exports = router;