const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controllers');



router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/logout',authMiddleware, authController.logout);
router.get('/', authController.getAllUsers);
router.get('/:id', authMiddleware, authController.profile);
router.delete('/:id', authMiddleware, authController.deleteUser);
router.put('/:id', authMiddleware, authController.updateDetails);



module.exports = router;