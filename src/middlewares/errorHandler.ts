import { errorResponse } from "@/utils/responses";
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);
    errorResponse(res, 500, err);
};

