const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/latest', reviewController.getLatestReviews);
router.post('/seed-demo', reviewController.seedDemoReviews);
router.get('/:propertyId', reviewController.getReviewsByProperty);
router.post('/', reviewController.createReview);

module.exports = router;
