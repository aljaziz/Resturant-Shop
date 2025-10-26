import express from "express";
import "dotenv/config";
import restaurantsRouter from "@/routes/restaurants";
import cusinesRouter from "@/routes/cuisines";
import config from "@/config";
import { errorHandler } from "./middlewares/errorHandler";
const PORT = config.PORT;

const app = express();

app.use(express.json());

app.use("/restaurants", restaurantsRouter);
app.use("/cuisines", cusinesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
}).on("error", (error) => {
    throw new Error(error.message);
});
