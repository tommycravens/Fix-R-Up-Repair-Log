// require dependencies
const express = require('express')

const passport = require('passport')

// create an express router object
const router = express.Router()
// require event model
const Equipment = require('../models/equipment')
// require custom error handlers
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

// Index: GET /events return all the events
router.get('/equipment', requireToken, (req, res, next) => {
	// fetch all the events from mongodb
	Equipment.find({ owner: req.user.id })
		// use mongoose toObject on each event to include virtuals
		.then((equipment) => equipment.map((equipment) => equipment.toObject()))
		// send response 200 with events to client
		.then((equipment) => res.json({ equipment: equipment }))
		// on error run next middleware
		.catch(next)
})

// Create: POST /events save the event data
router.post('/equipment', requireToken, (req, res, next) => {
	// get event data from request
	const equipment = req.body.equipment

	// Attach the owner using the `req.user.id`
	equipment.owner = req.user.id

	// save event to mongodb
	Equipment.create(equipment)
		// if successful respond with 201 and vocab json
		.then((equipment) => res.status(201).json({ equipment: equipment.toObject() }))
		// on error respond with 500 and error message
		.catch(next)
})

// Show: GET /events/100 return a event
router.get('/equipment/:id', requireToken, (req, res, next) => {
	// get id of event from params
	const id = req.params.id
	// fetching event by its id
	// Event.findById(id)
	Equipment.findOne({ owner: req.user.id, _id: id })
		// handle 404 error if no event found
		.then(handle404)
		// respond with json of the event
		// use mongoose toObject on event to include virtuals
		.then((equipment) => res.json({ equipment: equipment.toObject() }))
		// on error continue to error handling middleware
		.catch(next)
})

// Destroy: DELETE /events/:id delete the event
router.delete('/equipment/:id', requireToken, (req, res, next) => {
	const id = req.params.id
	Equipment.findById(id)
		// handle 404 error if no event found
		.then(handle404)
		.then((equipment) => requireOwnership(req, equipment))
		// delete event from mongodb
		.then((equipment) => {
			equipment.deleteOne()
		})
		// send 204 if successful
		.then(() => res.sendStatus(204))
		// on error go to next middleware
		.catch(next)
})

// Update: PATCH /events/:id
router.patch('/equipment/:id', requireToken, (req, res, next) => {
	// get id of event from params
	const id = req.params.id
	// get event data from request
	const equipmentData = req.body.equipment
	// fetching event by its id
	Equipment.findById(id)
		// handle 404 error if no event found
		.then(handle404)
		.then((equipment) => requireOwnership(req, equipment))
		// update event
		.then((equipment) => {
			// updating event object
			// with eventData
			Object.assign(equipment, equipmentData)
			// save event to mongodb
			return equipment.save()
		})
		// if successful return 204
		.then(() => res.sendStatus(204))
		// on error go to next middleware
		.catch(next)
})

module.exports = router
