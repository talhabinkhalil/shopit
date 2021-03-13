const express = require('express');
const Joi = require('joi');
const router = express.Router();
const auth = require('../middleware/auth')
const { Product } = require('../models/productModel')



// post or put a review
// protected by user who purchased that product
router.post('/review', auth, async (req, res) => {
    // Joi validation
    const { error } = reviewValidation(req.body)
    if (error) res.status(400).send(error.details[0].message)

    // destructuring the req.body
    const { rating, comment, productId } = req.body

    // create review object
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    // find product  by id
    const product = await Product.findById(productId)
    if (!product) return res.status(400).send("The Product with the given id is not present")

    // find if current user reviewed?
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        // loop through the reviews for selecting and updating it
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    // update the average rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    // save the product
    await product.save({ validateBeforeSave: false })

    res.send({
        success: true,
        review: { rating, comment, productId }
    })
})

const reviewValidation = (review) => {
    const schema = Joi.object({
        rating: Joi.number().required().valid(1, 2, 3, 4, 5),
        comment: Joi.string().required().min(5),
        productId: Joi.string().required()
    })
    return schema.validate(review)
}


module.exports = router;