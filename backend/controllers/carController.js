const Car = require('../models/Car');

// Create Car
exports.createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    // Update image paths to include full URL
    const images = req.files.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
    const car = await Car.create({ 
      title, 
      description, 
      tags: JSON.parse(tags || '{}'),
      images, 
      user: req.user.id 
    });
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all cars for user
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user.id });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json(car);
  } catch (error) {
    res.status(404).json({ error: "Car not found" });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { title, description } = req.body;
    let tags = {};
    let existingImages = [];
    
    try {
      tags = req.body.tags ? JSON.parse(req.body.tags) : {};
      existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

    const newImages = req.files ? 
      req.files.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`) : 
      [];

    if (existingImages.length + newImages.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed' });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { title, description, tags, images: [...existingImages, ...newImages] },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete Car
exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add search functionality
exports.searchCars = async (req, res) => {
  try {
    const { query } = req.query;
    const cars = await Car.find({
      user: req.user.id,
      $or: [
        { title: { $regex: query, $options: 'i' }},
        { description: { $regex: query, $options: 'i' }},
        { 'tags.car_type': { $regex: query, $options: 'i' }},
        { 'tags.company': { $regex: query, $options: 'i' }},
        { 'tags.dealer': { $regex: query, $options: 'i' }}
      ]
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
