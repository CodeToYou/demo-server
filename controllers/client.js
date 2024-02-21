import ProductDB from '../models/Product.js';


export const getBase = (req, res) => {

  res.status(200).send('<h1>Welcome to Store API</h1>');
  
}

export const getProducts = async (req, res) => {

  try {

    const items = await ProductDB.find({ enabled: true });
    res.status(200).json(items);

  } catch (error) {

    res.status(404).json({ message: error.message });

  }

}