const restaurantModel = require("../model/restaurantModel");
const userModel = require("../model/userModel");

const userController = {
    updateProfile  :  async (req, res) => {
        try {
            const updates = {
                name: req.body.name,
                phone: req.body.phone
            };
            const user = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    addFavorite : async (req, res) => {
        try {
            const { restaurantId } = req.params;
            const restaurant = await restaurantModel.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            const user = await userModel.findById(req.user.id);
            if (!user.favorites.includes(restaurantId)) {
                user.favorites.push(restaurantId);
                await user.save();
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    removeFavorite : async (req, res) => {
        try {
            const { restaurantId } = req.params;
            const user = await userModel.findById(req.user.id);
            user.favorites = user.favorites.filter(id => id.toString() !== restaurantId);
            await user.save();
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteAccount : async (req, res) => {
        try {
            await userModel.findByIdAndDelete(req.user.id);
            res.json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = userController;