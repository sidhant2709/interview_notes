import express from 'express';

import { fetchUsers } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/users', fetchUsers);

export default router;