import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  main: { type: Boolean, required: true, default: false },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },  
},
{
  collection: 'admin'
});

var Admin = mongoose.model("Admin", adminSchema);

export default Admin;