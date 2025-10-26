import { validate } from "@/middlewares/validate";
import { Restaurant, RestaurantSchema } from "@/Schema/restaurant";
import { initializedRedisClient } from "@/utils/client";
import { Router } from "express";

const router = Router();

router.post("/", validate(RestaurantSchema), async (req, res) => {
    const data = req.body as Restaurant;
    const client = await initializedRedisClient();
    res.send(data);
});

export default router;
