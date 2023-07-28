import express from "express";
import morgan from "morgan";
import fs from "fs";

import {
  getRecipes,
  getRecipeByID,
  createRecipe,
  updateRecipeByID,
  deleteRecipeByID,
} from "./recipes.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.use(morgan("combined"));

app.use((req, res, next) => {
  res.on("finish", () => {
    const log = `\nDate: ${new Date().toISOString()} \nMethod: ${req.method} \nPath: ${req.path} \nIP: ${req.ip} \nStatus:${res.statusCode} \nUser-Agent: ${req.get("User-Agent")}`;
    console.log(log);
    fs.appendFile("log.txt", log + "\n", (err) => {
      if (err) throw err;
    });
  });
  next();
});

app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await getRecipes();

    res.status(200).send({
      success: true,  
      payload: recipes 
    });
  } catch (error) {
    console.error(error);
    if (error.message === "Resource not found.") {
      return res.status(404).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    if (error.message === "There are no recipes to view!") {
      return res.status(404).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    if (error.message === "There is no data in the file.") {
      return res.status(404).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    res.status(404).send({
      success: false, 
      payload: []
    });
  }
});


app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await getRecipeByID(req.params.id);
    res.status(200).send({
      success: true,
      payload: recipe,
    });
  }
  catch (error) {
    console.error(error);
    if (error.message === "We couldn't find a recipe by this ID!") {
      return res.status(404).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    res.status(404).send({
      success: false,
      payload: [],
    });
  }
});

app.post("/api/recipes", async (req, res) => {
  try {
    const recipe = await createRecipe(req.body);
    res.status(201).send({
      success: true,
      payload: recipe,
    });
  }
  catch (error) {
    console.error(error);
    if (error.message === "A recipe with this title already exists!") {
      return res.status(409).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    if (error.message === "Please provide a title, ingredients, instructions, and an image for your recipe!") {
      return res.status(400).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    res.status(500).send({
      success: false,
      payload: [],
      message: "An error occurred while creating the recipe",
})}});

app.patch("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await updateRecipeByID(req.params.id, req.body);
    res.status(200).send({
      success: true,
      payload: recipe,
    });
  }
  catch (error) {
    console.error(error);
    if (error.message === "We couldn't find a recipe by this ID!") {
      return res.status(404).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    res.status(400).send({
      success: false,
      payload: [],
    });
  }
});

app.delete("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await deleteRecipeByID(req.params.id);
    res.status(200).send({
      success: true,
      payload: recipe,
    });
  } 
  catch (error) {
    console.error(error);
    if (error.message === "We couldn't find a recipe by this ID!") {
      return res.status(404).send({
        success: false,
        payload: [],
        message: error.message,
      });
    }
    res.status(404).send({
      success: false,
      payload: [],
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
