import { initializedRedisClient } from "@/utils/client";
import { restaurantKeyById } from "@/utils/keys";
import { errorResponse } from "@/utils/responses";
import type { Request, Response, NextFunction } from "express";

export const checkRestaurantExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { restaurantId } = req.params;
    if (!restaurantId) {
        return errorResponse(res, 400, "Restaurant ID not found");
    }

    const client = await initializedRedisClient();
    const restaurantKey = restaurantKeyById(restaurantId);
    const exists = await client.exists(restaurantKey);
    if (!exists) {
        return errorResponse(res, 400, "Restaurant Not Found");
    }
    next();
};
