const express = require("express");
require("dotenv").config();
const { instrument } = require("@socket.io/admin-ui");
const http = require("http");
const morgan = require("morgan");
const admin = require("firebase-admin");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const serviceAccount = require("./project-x-92081-6c41507a6aa7.json");
const generate_response = require("./chat.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: ["https://admin.socket.io"],
  credentials: true,
  maxHttpBufferSize: 1e8,
});

const upload = multer({ limits: 4 }); // 4MB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(":method :url :status - :remote-addr"));
app.use(cors());

instrument(io, { mode: "development", auth: false });

server.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
});

app.get("/api", (req, res) => {
  res.send("Hello World");
});

// Utility function to handle fetch requests
const handleFetch = async (url, options, res) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Middleware to set up headers for fetch requests
const setHeaders = (req) => ({
  headers: {
    Authorization: req.headers.authorization,
  },
});

// Common GET request handler
const handleGetRequest = async (endpoint, req, res) => {
  const url = `${BASE_URL}/api${endpoint}`;
  await handleFetch(url, { ...setHeaders(req), method: "GET" }, res);
};

// Common POST request handler
const handlePostRequest = async (endpoint, req, res) => {
  const url = `${BASE_URL}/api${endpoint}`;
  await handleFetch(
    url,
    {
      ...setHeaders(req),
      method: "POST",
      body: JSON.stringify(req.body),
    },
    res
  );
};

// Common DELETE request handler
const handleDeleteRequest = async (endpoint, req, res) => {
  const url = `${BASE_URL}/api${endpoint}`;
  await handleFetch(url, { ...setHeaders(req), method: "DELETE" }, res);
};

app.get("/api/courses/list", (req, res) => handleGetRequest("/courses/list", req, res));
app.get("/api/podcasts/list", (req, res) => handleGetRequest("/podcasts/list", req, res));

app.post("/api/courses/create", upload.single("file"), async (req, res) => {
  try {
    let formData = new FormData();
    formData.append("course_name", req.body.course_name);
    console.log(req.file);
    const blob = new Blob([req.file.buffer]);
    formData.append("file", blob, req.file.originalname);

    let data = await fetch(`${BASE_URL}/api/courses/create`, {
      headers: {
        Authorization: req.headers.authorization,
      },
      body: formData,
      method: "POST",
    })
      .then((r) => r.json())
      .catch((err) => {
        throw err
      });

    res.json(data);
  } catch (err) {
    if (err)
      res.status(500).send({
        success: false,
        error: err.message,
      });
  }
});

app.delete("/api/courses/:id", (req, res) => handleDeleteRequest(`/courses/${req.params.id}`, req, res));
app.delete("/api/podcasts/:id", (req, res) => handleDeleteRequest(`/podcasts/${req.params.id}`, req, res));
app.get("/api/courses/documents/:id", (req, res) => handleGetRequest(`/courses/documents/${req.params.id}`, req, res));
app.post("/api/search-queries", (req, res) => handlePostRequest("/search-queries", req, res));
app.post("/api/quiz", (req, res) => handlePostRequest("/quiz", req, res));
app.post("/api/podcasts/create", (req, res) => handlePostRequest("/podcasts/create", req, res));
app.get("/api/search", (req, res) => handleGetRequest(`/search?q=${req.query.q}&type=${req.query.type || "google"}`, req, res));
app.get("/api/reels", (req, res) => handleGetRequest(`/reels?q=${req.query.q}`, req, res));
app.get("/api/browser", (req, res) => handleGetRequest(`/browser?${req.query.aiEnhanced ? "aiEnhanced=" + req.query.aiEnhanced + "&" : ""}url=${req.query.url}`, req, res));

// Socket IO
io.on("connection", (client) => {
  console.log(`Connected to ${client.id}`);

  client.on("message", async (data, callback) => {
    try {
      let res = "";
      if (!data.token) res = "401 Unauthorized";
      else {
        let user = await admin.auth().verifyIdToken(data.token).catch((err) => {
          if (err) {
            res = "403 Forbidden";
            callback({ msg: res, from: "AI" });
          }
        });
        if (user.uid) {
          res = await generate_response(
            data.data.msg,
            data.data.queryMultipleDocs === true ? undefined : data.data.course,
            user.uid,
            data.data.context
          );
          console.log("AI Response: " + res);
        }
      }
      callback({ msg: res, from: "AI" });
    } catch (err) {
      callback({ msg: err.message, from: "AI" });
    }
  });
});
