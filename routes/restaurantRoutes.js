const express = require('express');
const { protect, allowRoles } = require('../middleware/auth');
const { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, uploadPhotos, deletePhoto, getMyRestaurants } = require('../controller/restaurantController');
const upload = require('../middleware/upload');

const restRouter = express.Router();

restRouter.post('/' , protect, allowRoles(['manager' , 'admin']) , createRestaurant);
restRouter.get('/' , getRestaurants);

restRouter.get('/my', protect, allowRoles(['manager', 'admin']), getMyRestaurants);

restRouter.route('/:id')
    .get(getRestaurantById)
    .put(protect, updateRestaurant)
    .delete(protect, deleteRestaurant);

restRouter.post('/:id/photos', protect, upload.array('photos', 5), uploadPhotos);
restRouter.delete('/:id/photos/:photoUrl', protect, deletePhoto);

module.exports = restRouter;