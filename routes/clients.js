import express from 'express';

import {
  getBase,
  getProducts
} from '../controllers/client.js';


const router = express.Router();


router.get('/', getBase);
router.get('/products/', getProducts);


export default router;