import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import notesRouters from "./routes/notes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

const app   = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/notes", notesRouters);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let statusCode   = 500;
    let errorMessage = "An unknown error occurres";
    if (isHttpError(error)){
        statusCode   = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;