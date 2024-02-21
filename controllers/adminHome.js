import mongoose from 'mongoose';
import ProductDB from '../models/Product.js';
import OrderDB from '../models/Order.js';


export const getHomeInfo = async (req, res) => {

  try {

    let day = new Date();
    let daySpc = new Date(day - 4*3600*1000);
    let date = daySpc.toISOString().split("T")[0];
    if ("date" in req.query) {
      if (req.query.date !== "") {
        date = req.query.date;
      }
    };

    const productList = await ProductDB.find({ enabled: true });

    /*
    function Last7Days () {
      let result = [];
      let day = new Date();
      for (let i=0; i<7; i++) {
        let d = new Date(day - 4*3600*1000);
        d.setDate(d.getDate() - i);
        result.push(d.toISOString())
      }
      return(result);
    }*/

    const filterFormat = date.includes("W") ? "%Y-W%V"  : date.split("-").length > 2 ? "%Y-%m-%d" : "%Y-%m";

    const items = await OrderDB.aggregate([
      {
        "$match": {
          "$expr": {
            "$eq": [
              {
                "$dateToString": { format: filterFormat, date: "$createdAt" }
              },
              date
            ]
          }
        }
      }
    ])

    let payments = {Total: 0};
    let productsGroup = {};
    items.forEach((x) => {
      x.payment.forEach((paymentType) => {
        if (paymentType.name in payments) {
          payments[paymentType.name] += paymentType.price;
        } else {
          payments[paymentType.name] = paymentType.price;
        }
        payments.Total += paymentType.price;
      })
      x.cart.forEach((productType) => {
        if (productType.name in productsGroup) {
          productsGroup[productType.name] += productType.quantity;
        } else {
          productsGroup[productType.name] = productType.quantity;
        }
      })
    })

    let profits = [];
    Object.keys(payments).forEach((item) => {
      profits.push({ name: item, total: payments[item] })
    });
    profits.sort((x1, x2) => x2.total - x1.total);
    
    let soldProducts = [];
    Object.keys(productsGroup).forEach((item) => {
      const baseProduct = productList.find((x) => x.name === item);
      soldProducts.push({
        _id: baseProduct._id,
        name: item,
        count: productsGroup[item],
        image: baseProduct.images.length > 0 ? baseProduct.images[0] : ""
      })
    });
    soldProducts.sort((x1, x2) => x2.count - x1.count);
  
    res.status(200).json({ profits, soldProducts});

  } catch (error) {

    res.status(404).json({ message: error.message });

  }

}