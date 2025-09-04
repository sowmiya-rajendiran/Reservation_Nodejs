const express = require('express');
const { protect } = require('../middleware/auth');
const bodyParser = require('body-parser');
const { checkAvailability, createReservation, getUserReservations, updateReservation, cancelReservation, stripeWebhook } = require('../controller/reservationController');

const reservationRouter = express.Router();

reservationRouter.post('/availability' , protect , checkAvailability );
reservationRouter.post('/', protect, createReservation);
reservationRouter.get('/', protect, getUserReservations);
reservationRouter.put('/:id', protect, updateReservation);
reservationRouter.delete('/:id', protect, cancelReservation);

reservationRouter.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = reservationRouter;