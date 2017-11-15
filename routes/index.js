const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const multer = require('multer');
var upload = multer({ dest: './uploads/restaurant_photo' });

/* GET home page. */
router.route('/')
	.get((req, res, next) => {
	  Restaurant.find((error, restaurants) => {
	  	if (error) {
	  		next(error);
	  	} else {
	  		res.render('restaurants/index', { restaurants });
	  	}
	  })
	})
  .post(upload.single('photo'), (req, res, next) => {

		console.log("El fichero es:");
		console.log(req.body.photo);
		console.log(req.file);


		let location = {
	    type: 'Point',
	    coordinates: [req.body.longitude, req.body.latitude]
	  };

  // Create a new Restaurant with location
    const newRestaurant = {
      name:        req.body.name,
      description: req.body.description,
      location:    location,
			foto: req.file.filename
    };

  	const restaurant = new Restaurant(newRestaurant);

  	restaurant.save()
			.then(r => {
				console.log(`Created restaurant: ${r._id} - ${r.name}`)
				return r;
			})
			.then(r => res.redirect('/'))
			.catch(e => next(e));

  });


router.route('/new')
	.get((req, res) => res.render('restaurants/new'));

router.route('/:restaurant_id')
	.get((req, res, next) => {
		Restaurant.findById(req.params.restaurant_id)
			.then( restaurant => res.render('restaurants/show', {restaurant}))
			.catch(e => next(e));
	})
	.post((req, res, next) => {
		Restaurant.findById(req.params.restaurant_id, (error, restaurant) => {
			if (error) {
				next(error);
			} else {
				restaurant.name        = req.body.name;
				restaurant.description = req.body.description;
				restaurant.save((error) => {
		  		if (error) {
		  			next(error);
		  		} else {
		  			res.redirect('/');
		  		}
		  	})
			}
		})
	});

router.route('/:restaurant_id/edit')
	.get((req, res, next) => {
		Restaurant.findById(req.params.restaurant_id, (error, restaurant) => {
			if (error) {
				next(error);
			} else {
				res.render('restaurants/update', { restaurant });
			}
		})
	});

router.route('/:restaurant_id/delete')
	.get((req, res, next) => {
		Restaurant.remove({ _id: req.params.restaurant_id }, function(error, restaurant) {
	    if (error) {
	    	next(error)
	    } else {
	    	res.redirect('/')
	    }
    });
	});


router.route('/api/all').get((req,res,next) =>{
	Restaurant.find({})
		.then(r => res.json(r))
		.catch(e => next(e));
})


router.route('/api/:id').get((req,res,next) =>{
	const restaurantID = req.params.id;
	Restaurant.findById(restaurantID)
		.then(r => res.json(r))
		.catch(e => next(e));
})


module.exports = router;
