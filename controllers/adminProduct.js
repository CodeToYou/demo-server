import mongoose from 'mongoose';
import ProductDB from '../models/Product.js';


export const getAllProducts = async (req, res) => { 

  try {

      const itemsV = await ProductDB.find(); 
      const items = itemsV?.map((item) => {
        const { _id, name, price, enabled } = item;
        return { _id, name, price, enabled };          
      });      
      res.status(200).json(items);

  } catch (error) {

      res.status(404).json({ message: error.message });

  }
  
}


export const createProduct = async (req, res) => {

  const { name, price, enabled } = req.body;

  try {

    const newItem = new ProductDB({ name, price, enabled })

    await newItem.save();

    res.status(201).json({ message: "Product added satisfactorily" });

  } catch (error) {

    res.status(409).json({ message: error.message });

  };

};


export const updateProduct = async (req, res) => {

  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No product with id: ${id}`});

  const { name, price, enabled } = req.body;

  try {

    let updatedAt = new Date();
    
    const updatedItem = { name, price, enabled, updatedAt };

    await ProductDB.findByIdAndUpdate(id, updatedItem, { new: true });
    
    res.json(updatedItem);

  } catch (error) {

    res.status(409).json({ message: error.message });

  }

}


export const deleteProduct = async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No product with id: ${id}`});

  await ProductDB.findByIdAndRemove(id);

  res.json({ message: "Product deleted successfully." });

}