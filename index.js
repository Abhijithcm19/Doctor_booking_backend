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

// Allowed frontends: the Netlify site (CLIENT_URL) and local dev servers
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

connectDatabase();
app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about our stack
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "dev-session-secret"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(express.json());

// Health check (Render pings this)
app.get("/", (req, res) => res.send("API running"));

app.use("/api/v1/auth", authRoute);
app.use("/users", patientRoute);
app.use("/doctors", doctorRoute);
app.use("/admin", adminRoute);
app.use("/reviews", reviewRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
