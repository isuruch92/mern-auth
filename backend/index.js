import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

//when importing local files, always keeps in mind to put the file extention
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

//connect to env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json()); //allows to parse incoming requests from req.body
app.use(cookieParser()); //allows us to parse incoming cookies

//Creating auth routes
app.use("/api/auth", authRoutes);

/* Production Mode: In this setup, the frontend is served by the backend in production.
   ====================================================================================
>> When process.env.NODE_ENV is set to "production", the Node.js backend serves the React frontend files.

>> The code app.use(express.static(path.join(__dirname, "/frontend/dist"))); tells the Express server to serve static files from the frontend/dist directory (where the built React app will be stored after running npm run build).

>> The app.get("*", (req, res) => { ... }) ensures that all routes not caught by the backend API routes (like /api/auth) will return the index.html file from the React build. This is necessary for React's client-side routing, ensuring that even if a user refreshes the page or navigates to a different route, they will still receive the React app. */

/* if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} */

app.listen(5000, () => {
  // connectDB();
  console.log("Server is running on port: ", PORT);
  console.log("HELLO ISURU");
});
