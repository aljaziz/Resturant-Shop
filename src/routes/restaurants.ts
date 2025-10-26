import {
    addRestaurant,
    getRestaurantDetailsById,
} from "@/controllers/restaurant";
import { checkRestaurantExists } from "@/middlewares/checkRestaurantId";
import { validate } from "@/middlewares/validate";
import { Restaurant, RestaurantSchema } from "@/Schema/restaurant";
import { Router } from "express";

const router = Router();

router.post("/add-restaurant", validate(RestaurantSchema), addRestaurant);

router.get("/:restaurantId", checkRestaurantExists, getRestaurantDetailsById);

export default router;
