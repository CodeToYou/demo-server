import express from 'express';

import { 
  getOrders,
  getRecycleBinOrders,
  createOrder, 
  updateOrder, 
  deleteOrder,
  moveOrderToRecycleBin,
  restoreOrder 
} from '../controllers/adminOrder.js';

import { 
  getProducts,
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  moveProductToRecycleBin,
  restoreProduct 
} from '../controllers/adminProduct.js';

import { 
  signin, 
  signup,
  getAllAdmin,
  deleteAdmin 
} from '../controllers/adminAdmin.js';  
         
import { getHomeInfo } from "../controllers/adminHome.js";  
         
import auth from "../middleware/auth.js";


const router = express.Router();


router.get('/order/', auth, getOrders);
router.get('/order/recycle', auth, getRecycleBinOrders);
router.post('/order/', auth, createOrder);
router.put('/order/:id', auth, updateOrder);
router.delete('/order/:id', auth, deleteOrder);
router.put('/order/:id/recycle', auth, moveOrderToRecycleBin);
router.put('/order/:id/restore', auth, restoreOrder);

router.get('/product/', auth, getProducts);
router.get('/products/', auth, getAllProducts);
router.post('/product/', auth, createProduct);
router.put('/product/:id', auth, updateProduct);
router.delete('/product/:id', auth, deleteProduct);
router.put('/product/:id/recycle', auth, moveProductToRecycleBin);
router.put('/product/:id/restore', auth, restoreProduct);

router.get('/admin/', auth, getAllAdmin);
router.delete('/admin/:id', auth, deleteAdmin);
router.post("/signin", signin);
router.post("/signup", signup);

router.get('/home', auth, getHomeInfo);


export default router;