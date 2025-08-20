const reservationModel = require("../model/reservationModel");
const restaurantModel = require("../model/restaurantModel");

const reservationController = {
    checkAvailability : async (req , res) => {
        try{
            const { restaurantId, date, time } = req.body;
            const existing = await reservationModel.find({ restaurant: restaurantId, date, time, status: 'confirmed' });
            const isAvailable = existing.length < 5; // example: max 5 reservations per time slot
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
    createReservation : async (req , res) => {
        try{
            const { restaurantId, date, time, guests  , partySize} = req.body;

            const restaurant = await restaurantModel.findById(restaurantId);

            if (!restaurant) {
                return res.status(404).json({ success: false, message: 'Restaurant not found' });
            }

            // Check availability before booking
            const existing = await reservationModel.find({ restaurant: restaurantId, date, time, status: 'confirmed' });
           
            // Calculate total seats already booked
            const totalBookedSeats = existing.reduce((sum, r) => sum + r.partySize, 0);

            if (totalBookedSeats + partySize > restaurant.tableCapacity) {
                return res.status(400).json({ message: 'No available tables for the selected time' });
            }

            const reservation = await reservationModel.create({
                user: req.user.id,
                restaurant: restaurantId,
                date,
                time,
                guests,
                partySize,
                status: 'confirmed'
            });
            res.status(201).json({ success: true, data: reservation });
        }
        catch(error){
            res.status(500).json({ success: false, message: error.message });
        }
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