import mongoose from 'mongoose';
import ProductDB from '../models/Product.js';


export const getProducts = async (req, res) => {

  try {

    const items = await ProductDB.find({ enabled: true });
    res.status(200).json(items);

  } catch (error) {

    res.status(404).json({ message: error.message });

  }

}


export const getAllProducts = async (req, res) => { 

  try {

      const items = await ProductDB.find();    
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

  try {

    await ProductDB.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully." });

  } catch (error) {

    res.status(409).json({ message: error.message });

  }
  
}


export const moveProductToRecycleBin = async (req, res) => {

  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No product with id: ${id}`});

  try {

    await ProductDB.findByIdAndUpdate(id, { enabled: false }, { new: true });
    
    res.json({ message: "Product moved to trash successfully" });

  } catch (error) {

    res.status(409).json({ message: error.message });

  }

}


export const restoreProduct = async (req, res) => {

  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No product with id: ${id}`});

  try {

    await ProductDB.findByIdAndUpdate(id, { enabled: true }, { new: true });
    
    res.json({ message: "Product restored satisfactorily" });

  } catch (error) {

    res.status(409).json({ message: error.message });

  }

}