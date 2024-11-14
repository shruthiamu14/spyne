const express = require('express');
const carController = require('../controllers/carController');
const { authenticate } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cars
 *     description: Car management routes
 */
// backend/routes/carRoutes.js
// Add this route before module.exports
/**
 * @swagger
 * /api/cars/search:
 *   get:
 *     summary: Search cars
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching cars
 */
router.get('/search', authenticate, carController.searchCars);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               tags:
 *                 type: object
 *                 properties:
 *                   car_type:
 *                     type: string
 *                   company:
 *                     type: string
 *                   dealer:
 *                     type: string
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authenticate, upload.array('images', 10), carController.createCar);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars for the logged-in user
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, carController.getCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car details
 *       404:
 *         description: Car not found
 */
router.get('/:id', authenticate, carController.getCarById);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update a car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               tags:
 *                 type: object
 *                 properties:
 *                   car_type:
 *                     type: string
 *                   company:
 *                     type: string
 *                   dealer:
 *                     type: string
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', authenticate, upload.array('images', 10), carController.updateCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */
router.delete('/:id', authenticate, carController.deleteCar);



module.exports = router;
