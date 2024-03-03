import mongoose from 'mongoose';
import OrderDB from '../models/Order.js';


export const getOrders = async (req, res) => { 

  try {

      const items = await OrderDB.find({ enabled: true });  
      res.status(200).json(items);

  } catch (error) {

      res.status(404).json({ message: error.message });

  }
  
}


export const getRecycleBinOrders = async (req, res) => { 

  try {

      const items = await OrderDB.find({ enabled: false });    
      res.status(200).json(items);

  } catch (error) {

      res.status(404).json({ message: error.message });

  }
  
}


export const getOrder = async (req, res) => {

  try {

    const { id } = req.params;
    const item = await OrderDB.findById(id);
    res.status(200).json(item);

  } catch (error) {

    res.status(404).json({ message: error.message });

  }

}


export const createOrder = async (req, res) => {

  const { client, cart, payment, total, enabled } = req.body;

  try {

    const maxItem = await OrderDB.find().sort({ orderN: -1 }).limit(1);

    const orderN = maxItem.length > 0 ? (maxItem[0]?.orderN || 0) + 1 : 1;

    const day = new Date();
    const daySpc = new Date(day - 4*3600*1000);

    const newItem = new OrderDB({ client, cart, payment, total, orderN, enabled, createdAt: daySpc, updatedAt: daySpc })

    await newItem.save();

    res.status(201).json({ message: "Order added satisfactorily", orderN });

  } catch (error) {

    res.status(409).json({ message: error.message });

  };

};


export const updateOrder = async (req, res) => {

  const { id } = req.params;
  const { client, cart, payment, total, enabled } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No order with id: ${id}`});

  try {

    let updatedAt = new Date();
    
    const updatedItem = { client, cart, payment, total, enabled, updatedAt };

    await OrderDB.findByIdAndUpdate(id, updatedItem, { new: true });
    
    res.json(updatedItem);

  } catch (error) {

    res.status(409).json({ message: error.message });

  }

}


export const deleteOrder = async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No order with id: ${id}`});

  try {

    await OrderDB.findByIdAndDelete(id);

    res.json({ message: "Order deleted successfully." });

  } catch (error) {

    res.status(409).json({ message: error.message });

  }
}


export const moveOrderToRecycleBin = async (req, res) => {

  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No order with id: ${id}`});

  try {

    await OrderDB.findByIdAndUpdate(id, { enabled: false }, { new: true });
    
    res.json({ message: "Order moved to trash successfully" });

  } catch (error) {

    res.status(409).json({ message: error.message });

  }

}


export const restoreOrder = async (req, res) => {

  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No order with id: ${id}`});

  try {

    await OrderDB.findByIdAndUpdate(id, { enabled: true }, { new: true });
    
    res.json({ message: "Order restored satisfactorily" });

  } catch (error) {

    res.status(409).json({ message: error.message });

  }

}