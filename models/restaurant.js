const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: String,
  description: String,
  location: { type: { type: String }, coordinates: [Number] },
  foto: String
});

RestaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
