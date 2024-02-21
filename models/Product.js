import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },  
  enabled: { type: Boolean, default: true },
},
{
  collection: 'product'
})

let Product = mongoose.model("Product", productSchema);

export default Product;