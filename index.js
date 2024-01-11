import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoute from "./routes/authRoutes/authRouter.js";
import patientRoute from "./routes/patientRoutes/patientRouter.js";
import doctorRoute from "./routes/doctorRoutes/doctorRouter.js";
import reviewRoute from "./routes/reviewRoutes/reviewRouter.js";
import { authenticate, restrict } from "./auth/verifyToken.js";
import adminRoute from "./routes/adminRoutes/adminRouter.js";
import connectDatabase from "./config/database.js";
import passport from "passport";
import cookieSession from "cookie-session";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// const corsOptions = {
//     origin:true
// }

connectDatabase();
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about our stack
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: ["abhijith"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(express.json());
app.use(cors());
// app.use(cookieParser(corsOptions))

app.use("/api/v1/auth", authRoute);
app.use("/users", patientRoute);
app.use("/doctors", doctorRoute);
app.use("/admin", adminRoute);
app.use("/reviews ", reviewRoute);

app.listen(port, () => {
  connectDatabase();
  console.log(`Server connected to http://localhost:${port}`);
});
