import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  ordern: Number,
  client: {
    name: String,
    id: String
  },
  cart: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  payment: [{
    name: String,
    price: Number,
  }],
  total: Number,
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },  
  enabled: { type: Boolean, default: true },
}, {
  collection: "order"
})

var Order = mongoose.model("Order", orderSchema)

export default Order;