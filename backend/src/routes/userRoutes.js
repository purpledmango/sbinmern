import { Router } from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import authJWTMiddleware from "../utils/authMiddleware.js";

const router = Router();

router.get("/profile", async (req, res) => {
  try {
    const uid = req.user.uid;
    console.log("UID", uid);
    const data = await User.findOne({ uid });
    console.log("Queried data for the  user", data);
    res.status(200).json({ message: "User fetched", data: data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    console.log(req.user);

    const data = await User.find({});
    res.status(200).json({ message: "All users fetched", data });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.patch("/add-to-fav/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params; // Corrected destructuring to access propertyId
    const email = req.user.email; // Assuming the user is authenticated and their email is available
    const user = await User.findOne({ email: email }); // Use findOne to get a single user

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Adding the propertyId to the favorite list
    if (!user.favorites) {
      user.favorites = []; // Initialize favorites array if it doesn't exist
    }
    user.favorites.push(propertyId); // Correct method to append to an array

    await user.save(); // Save the updated user document to the database

    res
      .status(200)
      .json({ message: "Property added to favorites successfully!" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong!" }); // Send a response with error message
  }
});

router.patch(
  "/remove-from-fav/:propertyId",
  authJWTMiddleware,
  async (req, res) => {
    try {
      const { propertyId } = req.params; // Access propertyId from route params
      const email = req.user.email; // Assuming user is authenticated and email is available
      const user = await User.findOne({ email: email }); // Fetch user based on email

      if (!user) {
        return res.status(404).json({ message: "User not found" }); // Return error if user not found
      }

      // Check if the user has a favorites list
      if (!user.favorites || !user.favorites.includes(propertyId)) {
        return res.status(400).json({ message: "Property not in favorites" }); // If the property is not in favorites
      }

      // Remove the propertyId from the favorites array
      user.favorites = user.favorites.filter((id) => id !== propertyId); // Filter out the propertyId

      await user.save(); // Save the updated user document to the database

      res
        .status(200)
        .json({ message: "Property removed from favorites successfully!" }); // Success response
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: "Something went wrong!" }); // Send a general error message
    }
  }
);

router.get("/get-fav", async (req, res) => {
  try {
    const email = req.user.email; // Assuming user is authenticated and email is available
    const user = await User.findOne({ email: email }); // Find user by email

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return error if user not found
    }

    // Check if the user has favorites
    if (!user.favorites || user.favorites.length === 0) {
      return res.status(200).json({ message: "No favorites yet" }); // If no favorites, return a message
    }

    // Fetch the properties based on favorite IDs, if you have a Property model
    const favoriteProperties = await propertyModel.find({
      propertyId: { $in: user.favorites },
    });

    res
      .status(200)
      .json({ message: "Favourites Fetched!", data: favoriteProperties }); // Send back the favorite properties
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Something went wrong!" }); // Send a general error message
  }
});

router.get("/is-favorite/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params; // Access propertyId from route params
    const email = req.user.email; // Assuming user is authenticated and email is available

    const user = await User.findOne({ email: email }); // Find the user by email

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return error if user is not found
    }

    const isFavorite = user.favorites.includes(propertyId);

    if (!isFavorite) {
      return res
        .status(200)
        .json({ message: "Property is not in favorites", isFavorite: false }); // If the property is not a favorite
    } else {
      return res
        .status(200)
        .json({ message: "Property is in favorites", isFavorite: true }); // If the property is a favorite
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Something went wrong!" }); // Return generic error message
  }
});

router.get("/get-contact-info/:uid", authJWTMiddleware, async (req, res) => {
  try {
    const { uid } = req.params;

    // Find the user by UID
    const user = await User.findOne({ uid: uid });

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "UID does not match any user, failed getting user contact info" });
    }

    // Return the user's contact info
    res.status(200).json({ message: "Contact Info Fetched", data: user });
  } catch (error) {
    console.error("Error fetching contact info:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
