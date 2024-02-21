import express from 'express';

import { getAllOrders, 
         createOrder, 
         updateOrder, 
         deleteOrder,
         getAllOrdersRecycleBin,
         moveOrderToRecycleBin,
         restoreOrder } from '../controllers/adminOrder.js';

import { getAllProducts, 
         createProduct, 
         updateProduct, 
         deleteProduct } from '../controllers/adminProduct.js';

import { getAllAdmin,
         deleteAdmin } from '../controllers/adminAdmin.js';

import { signin, 
         signup } from "../controllers/admin.js";      
         
import { getHomeInfo } from "../controllers/adminHome.js";  
         
import auth from "../middleware/auth.js";


const router = express.Router();

router.get('/order/', auth, getAllOrders);
router.post('/order/', auth, createOrder);
router.patch('/order/:id', auth, updateOrder);
router.delete('/order/:id', auth, deleteOrder);
router.get('/order/recycle', auth, getAllOrdersRecycleBin);
router.delete('/order/recycle/:id', auth, moveOrderToRecycleBin);
router.delete('/order/restore/:id', auth, restoreOrder);

router.get('/product/', auth, getAllProducts);
router.post('/product/', auth, createProduct);
router.patch('/product/:id', auth, updateProduct);
router.delete('/product/:id', auth, deleteProduct);

router.get('/admin/', auth, getAllAdmin);
router.delete('/admin/:id', auth, deleteAdmin);

router.get('/home', auth, getHomeInfo);

router.post("/signin", signin);
router.post("/signup", signup);


export default router;