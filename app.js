const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");

const Photo = require("./models/Photo");
const photoController = require("./controllers/photoController");

const app = express();

// file upload
app.use(fileUpload());

// connect db
const LOCAL_DB = "mongodb://localhost/pcat-test-db";
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log(err);
  });

// declearing my own middleware
const myLogger = (req, res, next) => {
  console.log("hello");
  next();
};

// serving static files
app.use(express.static("public"));

// Template Engine
app.set("view engine", "ejs");
app.set("views", "views");

// middlewares
app.use(myLogger);
// body-parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Routes
app.get("/", photoController.getAllPhotos);
app.get("/photos/:id", photoController.getPhoto);
app.post("/photos", photoController.createPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add", (req, res) => {
  res.render("add");
});

// Create Photo

// edit sayfasını açmak
app.get("/photos/edit/:id", async (req, res) => {
  const id = req.params.id;
  const photo = await Photo.findById(id);
  res.render("edit", { photo });
});

// update

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

// res.send() => her türden veri gönderimi
// res.sendFile()
// res.redirect()
