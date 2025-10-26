import { Restaurant } from "@/Schema/restaurant";
import { initializedRedisClient } from "@/utils/client";
import { restaurantKeyById } from "@/utils/keys";
import { errorResponse, successResponse } from "@/utils/responses";
import type { Request, Response } from "express";
import { nanoid } from "nanoid";

export const addRestaurant = async (req: Request, res: Response) => {
    const data = req.body as Restaurant;
    try {
        const client = await initializedRedisClient();
        const id = nanoid();
        const restaurantkey = restaurantKeyById(id);

        const hashData = { id, name: data.name, location: data.location };

        client.hSet(restaurantkey, hashData);

        return successResponse(res, hashData, "Added new Restaurant");
    } catch (error) {
        errorResponse(res, 500, error as string);
    }
};

export const getRestaurantDetailsById = async (req: Request, res: Response) => {
    const { restaurantId } = req.params;

    try {
        const client = await initializedRedisClient();
        const restaurantKey = restaurantKeyById(restaurantId);
        const [viewCount, restaurant] = await Promise.all([
            client.hIncrBy(restaurantKey, "viewCount", 1),
            client.hGetAll(restaurantKey),
        ]);

        return successResponse(res, restaurant);
    } catch (error) {
        return errorResponse(res, 500, error as string);
    }
};
