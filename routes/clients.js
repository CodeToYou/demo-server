import express from 'express';

import {
  getBase
} from '../controllers/client.js';


const router = express.Router();


router.get('/', getBase);


export default router;