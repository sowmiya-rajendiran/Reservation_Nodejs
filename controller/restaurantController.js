const restaurantModel = require("../model/restaurantModel");

const restaurantController = {
    createRestaurant : async (req , res) => {
        try{
            const {
                name, location, contact, cuisine, priceRange,
                openingHours, menu, photos,tableCapacity
            } = req.body;

            if (!name || !location || !contact || !cuisine) {
                return res.status(400).json({ message: 'Required fields are missing' });
            }

            const newRestaurant = await restaurantModel.create({
                owner: req.user._id,
                name,
                location,
                contact,
                cuisine,
                priceRange,
                openingHours,
                menu,
                photos,
                tableCapacity
            });

            res.status(201).json(newRestaurant);
        } catch(error){
            res.status(500).json({ message: "server error on create Restaurant controller" , error : error.message });
        }
    },
    getRestaurants : async (req , res) => {
        try{
            const {
                cuisine,
                priceRange,
                city,
                search,
                dietaryRestrictions,
                features

            } = req.query;

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            let filter = {};

            if (cuisine) filter.cuisine = { $regex: cuisine, $options: 'i' };
            if (priceRange) filter.priceRange = priceRange;
            if (city) filter['location.city'] = { $regex: city, $options: 'i' };

            // Extra filters
            if (dietaryRestrictions) filter.dietaryRestrictions = { $in: dietaryRestrictions.split(',') };
            // if (ambiance) filter.ambiance = { $regex: ambiance, $options: 'i' };
            if (features) filter.features = { $in: features.split(',') };

            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { cuisine: { $regex: search, $options: 'i' } }
                ];
            }

            const total = await restaurantModel.countDocuments(filter);
            const restaurants = await restaurantModel.find(filter)
                .skip(skip)
                .limit(limit);

            res.status(200).json({
                total,
                page,
                pages: Math.ceil(total / limit),
                count: restaurants.length,
                data: restaurants
            });

        }catch(error){
            res.status(500).json({ message : 'server error on getRestaurant controller' , error: error.message });
        }
    },
    getRestaurantById : async (req , res) => {
        try {
            const restaurant = await restaurantModel.findById(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
            res.status(200).json(restaurant);
        } catch (error) {
            res.status(500).json({ message : 'server error on getRestaurantById controller' , error: error.message });
        }
    },
    updateRestaurant : async (req , res) => {
        try {
            let restaurant = await restaurantModel.findById(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this restaurant' });
            }

            restaurant = await restaurantModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            res.status(200).json(restaurant);
        } catch (error) {
            res.status(500).json({ message : 'server error on update Restaurant controller' , error: error.message });
        }
    },
    deleteRestaurant : async (req , res) => {
        try {
            const restaurant = await restaurantModel.findById(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
            }

            await restaurant.deleteOne();
            res.status(200).json({ message: 'Restaurant deleted successfully' });
        } catch (error) {
            res.status(500).json({ message : 'server error on delete Restaurant controller' , error: error.message });
        }
    },
    // Upload new photos
    uploadPhotos  : async (req, res) => {
        try {
            const restaurant = await restaurantModel.findById(req.params.id);

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            const photoUrls = req.files.map(file => `/uploads/${file.filename}`);
            restaurant.photos.push(...photoUrls);

            await restaurant.save();
            res.json({ message: 'Photos uploaded successfully', photos: restaurant.photos });

        } catch (error) {
            res.status(500).json({ message : 'server error on upload photos controller' , error: error.message });
        }
    },

    deletePhoto  :  async (req, res) => {
        try {
            const restaurant = await restaurantModel.findById(req.params.id);

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            restaurant.photos = restaurant.photos.filter(photo => photo !== req.params.photoUrl);
            await restaurant.save();

            res.json({ message: 'Photo deleted successfully', photos: restaurant.photos });

        } catch (error) {
            res.status(500).json({ message : 'server error on delete photo controller' , error: error.message });
        }
    }
}

module.exports = restaurantController;