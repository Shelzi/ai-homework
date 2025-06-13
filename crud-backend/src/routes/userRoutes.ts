import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';

const router = Router();
const userController = new UserController();

// Validation middleware
const validateUser = [
  body('name').notEmpty().trim(),
  body('username').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').notEmpty().trim(),
  body('website').optional().isURL(),
  body('address').optional().isObject(),
  body('address.street').optional().notEmpty().trim(),
  body('address.suite').optional().notEmpty().trim(),
  body('address.city').optional().notEmpty().trim(),
  body('address.zipcode').optional().notEmpty().trim(),
  body('address.geo').optional().isObject(),
  body('address.geo.lat').optional().notEmpty().trim(),
  body('address.geo.lng').optional().notEmpty().trim(),
  body('company').optional().isObject(),
  body('company.name').optional().notEmpty().trim(),
  body('company.catchPhrase').optional().notEmpty().trim(),
  body('company.bs').optional().notEmpty().trim()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Public routes
router.post('/login', validateLogin, userController.login.bind(userController));
router.post('/register', validateUser, userController.createUser.bind(userController));
router.get('/', userController.getAllUsers.bind(userController));

// Protected routes
router.use(authenticateToken);
router.get('/:id', userController.getUser.bind(userController));
router.put('/:id', validateUser, userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));

export default router; 