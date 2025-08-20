const express = require('express');
const { protect } = require('../middleware/auth');
const { checkAvailability, createReservation, getUserReservations, updateReservation, cancelReservation } = require('../controller/reservationController');

const reservationRouter = express.Router();

reservationRouter.post('/availability' , protect , checkAvailability );
reservationRouter.post('/', protect, createReservation);
reservationRouter.get('/', protect, getUserReservations);
reservationRouter.put('/:id', protect, updateReservation);
reservationRouter.delete('/:id', protect, cancelReservation);

module.exports = reservationRouter;