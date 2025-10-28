import { Review } from "@/Schema/cusine";
import { Restaurant } from "@/Schema/restaurant";
import { initializedRedisClient } from "@/utils/client";
import {
    restaurantKeyById,
    reviewDetailsKeyById,
    reviewKeyById,
} from "@/utils/keys";
import { errorResponse, successResponse } from "@/utils/responses";
import { timeStamp } from "console";
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

export const addReviews = async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    const data = req.body as Review;
    try {
        const client = await initializedRedisClient();
        const reviewId = nanoid();
        const reviewKey = reviewKeyById(restaurantId);
        const reviewDetailsKey = reviewDetailsKeyById(reviewId);
        const restaurantKey = restaurantKeyById(restaurantId);
        const reviewData = {
            id: reviewId,
            ...data,
            timestamp: Date.now(),
            restaurantId,
        };
        const [reviewCount, setResult] = await Promise.all([
            client.lPush(reviewKey, reviewId),
            client.hSet(reviewDetailsKey, reviewData),
        ]);

        return successResponse(res, reviewData, "Review added");
    } catch (error) {
        return errorResponse(res, 500, error as string);
    }
};

export const getReviews = async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit) - 1;

    try {
        const client = await initializedRedisClient();
        const reviewKey = reviewKeyById(restaurantId);
        const reviewIds = await client.lRange(reviewKey, start, end);
        const reviews = await Promise.all([
            reviewIds.map((id) => client.hGetAll(reviewDetailsKeyById(id))),
        ]);
        return successResponse(res, reviews);
    } catch (error) {
        return errorResponse(res, 500, error as string);
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    const { restaurantId, reviewId } = req.params;
    try {
        const client = await initializedRedisClient();
        const reviewKey = reviewKeyById(restaurantId);
        const reviewDetailsKey = reviewDetailsKeyById(reviewId);
        const [removeResult, deleteResult] = await Promise.all([
            client.lRem(reviewKey, 0, reviewId),
            client.del(reviewDetailsKey),
        ]);
        if (removeResult === 0 && deleteResult === 0) {
            return errorResponse(res, 404, "Review not found");
        }
        return successResponse(res, reviewId, "Review deleted");
    } catch (error) {
        return errorResponse(res, 500, error as string);
    }
};
