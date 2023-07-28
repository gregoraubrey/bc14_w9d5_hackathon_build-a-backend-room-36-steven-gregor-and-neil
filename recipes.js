import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

const fileName = "recipes.json";

// GET ALL RECIPES
export async function getRecipes() {
    try {
        const data = await fs.readFile(fileName);
        if (data.length === 0) {
            throw new Error("There is no data in the file.");
        }
        const recipes = JSON.parse(data);
        if (!recipes) {
            throw new Error("Resource not found.");
        }
        if (recipes.length === 0) {
            throw new Error("There are no recipes to view!");
        }
        return recipes;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


// GET A RECIPE BY ID
export async function getRecipeByID(id) {
    try {
        const data = await fs.readFile(fileName);
        const recipes = JSON.parse(data);
        const index = recipes.findIndex((r) => r.id === id);
        if (index === -1) {
            throw new Error("We couldn't find a recipe by this ID!");
        }
        return recipes[index];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// CREATE A RECIPE
export async function createRecipe(newRecipe) {
    try {
        const data = await fs.readFile(fileName);
        const recipes = JSON.parse(data);
        const existingRecipe = recipes.find((r) => r.title === newRecipe.title);
        if (existingRecipe) {
            throw new Error("A recipe with this title already exists!");
        }
        if (!newRecipe.title || !newRecipe.ingredients || !newRecipe.instructions || !newRecipe.image) {
            throw new Error("Please provide a title, ingredients, instructions, and an image for your recipe!");
        }
        const recipe = { id: uuidv4(), ...newRecipe };
        recipes.push(recipe);
        await fs.writeFile(fileName, JSON.stringify(recipes));
        return recipe;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// UPDATE A RECIPE BY ID
export async function updateRecipeByID(id, updatedRecipe) {
    try {
        const data = await fs.readFile(fileName);
        const recipes = JSON.parse(data);
        const index = recipes.findIndex((r) => r.id === id);
        if (index === -1) {
            throw new Error("We couldn't find a recipe by this ID!");
        }
        recipes[index] = { id, ...updatedRecipe };
        await fs.writeFile(fileName, JSON.stringify(recipes));
        return recipes[index];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// DELETE A RECIPE BY ID
export async function deleteRecipeByID(id) {
    try {
        const data = await fs.readFile(fileName);
        const recipes = JSON.parse(data);
        const index = recipes.findIndex((r) => r.id === id);
        if (index === -1) {
            throw new Error("We couldn't find a recipe by this ID!");
        }
        let copy = [...recipes];
        recipes.splice(index, 1);
        await fs.writeFile(fileName, JSON.stringify(recipes));
        return copy[index];
    } catch (error) {
        console.log(error);
        throw error;
    }
}
