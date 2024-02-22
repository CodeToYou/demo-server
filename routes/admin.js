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


router.get('/order/', getOrders);
router.get('/order/recycle', getRecycleBinOrders);
router.post('/order/', createOrder);
router.put('/order/:id', updateOrder);
router.delete('/order/:id', deleteOrder);
router.put('/order/:id/recycle', moveOrderToRecycleBin);
router.put('/order/:id/restore', restoreOrder);

router.get('/product/', getProducts);
router.get('/products/', getAllProducts);
router.post('/product/', createProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);
router.put('/product/:id/recycle', moveProductToRecycleBin);
router.put('/product/:id/restore', restoreProduct);

router.get('/admin/', getAllAdmin);
router.delete('/admin/:id', deleteAdmin);
router.post("/signin", signin);
router.post("/signup", signup);

router.get('/home', getHomeInfo);


export default router;