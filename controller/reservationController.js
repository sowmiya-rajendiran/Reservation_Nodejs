const Stripe = require('stripe');
const reservationModel = require("../model/reservationModel");
const restaurantModel = require("../model/restaurantModel");
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require('../utils/config');
const stripe = Stripe(STRIPE_SECRET_KEY);

const reservationController = {
    checkAvailability : async (req , res) => {
        try{
            const { restaurantId, date, time } = req.body;
            const existing = await reservationModel.find({ restaurant: restaurantId, date, time, status: 'confirmed' });
            const isAvailable = existing.length < 5;
            res.status(200).json({
                success : true,
                available: isAvailable
            })
        }catch(err){
            res.status(500).json({
                success: false,
                message: 'Server error during checkAvailability'
            })
        }
    },
    createReservation: async (req, res) => {
    try {
      const { restaurantId, date, time, guests, partySize, amount } = req.body;

      const restaurant = await restaurantModel.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: "Restaurant not found" });
      }

      // Availability check
      const existing = await reservationModel.find({
        restaurant: restaurantId,
        date,
        time,
        status: "confirmed",
      });
      const totalBookedSeats = existing.reduce((sum, r) => sum + r.partySize, 0);
      if (totalBookedSeats + partySize > restaurant.tableCapacity) {
        return res.status(400).json({ message: "No available tables for the selected time" });
      }

      // Save pending reservation
      const reservation = await reservationModel.create({
        user: req.user.id,
        restaurant: restaurantId,
        date,
        time,
        guests,
        partySize,
        amount,
        status: "pending",
        paymentStatus: "unpaid",
      });

      // Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd", // use "inr" if required
              product_data: {
                name: `Reservation at ${restaurant.name}`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        // success_url: `http://localhost:5173/userdashboard?success=true&resId=${reservation._id}`,
        // cancel_url: `http://localhost:5173/userdashboard?canceled=true&resId=${reservation._id}`,
        success_url: `http://localhost:5173/userdashboard`,
        cancel_url: `http://localhost:5173/userdashboard?canceled=true&resId=${reservation._id}`,
        
        metadata: { reservationId: reservation._id.toString() },
      });

      res.status(201).json({
        success: true,
        sessionId: session.id,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Stripe webhook to auto-confirm reservations
  stripeWebhook: async (req, res) => {
    let event;

    try {
      const sig = req.headers["stripe-signature"];
      event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservationId = session.metadata.reservationId;

      // Update reservation after payment
      await reservationModel.findByIdAndUpdate(reservationId, {
        status: "confirmed",
        paymentStatus: "paid",
        amount: session.amount_total / 100,
      });
    }

    res.json({ received: true });
  },
    getUserReservations : async (req, res) => {
        try{
            const reservations = await reservationModel.find({ user: req.user.id }).populate('restaurant');
            res.json({ success: true, data: reservations });
        }catch(error){
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateReservation : async (req, res) => {
        try {
            const reservation = await reservationModel.findOne({ _id: req.params.id, user: req.user.id });
            if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

            if (req.body.date) reservation.date = req.body.date;
            if (req.body.time) reservation.time = req.body.time;
            if (req.body.partySize) reservation.partySize = req.body.partySize;

            await reservation.save();
            res.json({ success: true, data: reservation });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    cancelReservation :  async (req, res) => {
        try {
            const reservation = await reservationModel.findOne({ _id: req.params.id, user: req.user.id });
            if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

            reservation.status = 'cancelled';
            await reservation.save();

            res.json({ success: true, message: 'Reservation cancelled' });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = reservationController;