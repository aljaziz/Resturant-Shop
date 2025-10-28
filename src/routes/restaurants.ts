import {
    addRestaurant,
    addReviews,
    deleteReview,
    getRestaurantDetailsById,
    getReviews,
} from "@/controllers/restaurant";
import { checkRestaurantExists } from "@/middlewares/checkRestaurantId";
import { validate } from "@/middlewares/validate";
import { ReviewSchema } from "@/Schema/cusine";
import { RestaurantSchema } from "@/Schema/restaurant";
import { Router } from "express";

const router = Router();

router.post("/add-restaurant", validate(RestaurantSchema), addRestaurant);

router.get("/:restaurantId", checkRestaurantExists, getRestaurantDetailsById);

router.post(
    "/:restaurantId/reviews",
    checkRestaurantExists,
    validate(ReviewSchema),
    addReviews
);

router.get("/:restaurantId/reviews", checkRestaurantExists, getReviews);

router.delete(
    "/:restaurantId/reviews/:reviewId",
    checkRestaurantExists,
    deleteReview
);

export default router;
