import mongoose from 'mongoose';
import ProductDB from '../models/Product.js';
import OrderDB from '../models/Order.js';


export const getHomeInfo = async (req, res) => {

  try {

    let day = new Date();
    let daySpc = new Date(day - 4*3600*1000);
    let startDate = daySpc.toISOString().split("T")[0];
    let endDate = "";
    if ("date" in req.query) {
      if (req.query.date !== "") {
        const dates = req.query.date.split("/")[0];
        startDate = dates[0];
        endDate = dates.length > 1 ? dates[1] : "";
      }
    };

    let items = {};

    items.count = [ await ProductDB.countDocuments({ enabled: true }), // Active Products
                    await OrderDB.countDocuments({ enabled: false }), // Close Orders
                    await OrderDB.countDocuments({ enabled: true })]; // Active Orders


    let ordersRange = [];

    if ( endDate === "" ) {

      ordersRange = await OrderDB.aggregate([
        {
          "$match": {
            "$expr": {
              "$eq": [
                {
                  "$dateToString": { format: "%Y-%m-%d", date: "$createdAt" }
                },
                startDate
              ]
            }
          }
        }
      ])

    } else {

      ordersRange = await OrderDB.find(
        { 
          createdAt: { 
            $gte: ISODate(startDate), 
            $lt: ISODate(endDate) 
          } 
        }
      );

    }

    let payments = { Total: 0 };
    let productsGroup = {};
    ordersRange.forEach((x) => {
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

    items.profits = [];
    Object.keys(payments).forEach((item) => {
      items.profits.push({ name: item, total: payments[item] })
    });
    items.profits.sort((x1, x2) => x2.total - x1.total);
    
    items.soldProducts = [];
    const productList = await ProductDB.find({ enabled: true });
    Object.keys(productsGroup).forEach((item) => {
      const baseProduct = productList.find((x) => x.name === item);
      items.soldProducts.push({
        _id: baseProduct._id,
        name: item,
        count: productsGroup[item],
        image: baseProduct.images.length > 0 ? baseProduct.images[0] : ""
      })
    });
    items.soldProducts.sort((x1, x2) => x2.count - x1.count);


    res.status(200).json(items);

  } catch (error) {

    res.status(404).json({ message: error.message });

  }

}

export const getHomeCardsCount = async (req, res) => {

  try {

    const count = [ await ProductDB.countDocuments({ enabled: true }), // Active Products
                    await OrderDB.countDocuments({ enabled: false }), // Close Orders
                    await OrderDB.countDocuments({ enabled: true }) ]; // Active Orders

    res.status(200).json(count);

  } catch (error) {

    res.status(404).json({ message: error.message });

  }

}

export const getHomeBalance = async (req, res) => {

  try {

    let day = new Date();
    let daySpc = new Date(day - 4*3600*1000);
    let startDate = daySpc.toISOString().split("T")[0];
    let endDate = "";
    if ("date" in req.query) {
      if (req.query.date !== "") {
        const dates = req.query.date.split("/")[0];
        startDate = dates[0];
        endDate = dates.length > 1 ? dates[1] : "";
      }
    };

    let items = {};

    let ordersRange = [];

    if ( endDate === "" ) {

      ordersRange = await OrderDB.aggregate([
        {
          "$match": {
            "$expr": {
              "$eq": [
                {
                  "$dateToString": { format: "%Y-%m-%d", date: "$createdAt" }
                },
                startDate
              ]
            }
          }
        }
      ])

    } else {

      ordersRange = await OrderDB.find(
        { 
          createdAt: { 
            $gte: startDate, 
            $lt: endDate
          } 
        }
      );

    }

    let payments = { Total: 0 };
    let productsGroup = {};
    ordersRange.forEach((x) => {
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

    items.profits = [];
    Object.keys(payments).forEach((item) => {
      items.profits.push({ name: item, total: payments[item] })
    });
    items.profits.sort((x1, x2) => x2.total - x1.total);
    
    items.soldProducts = [];
    const productList = await ProductDB.find({ enabled: true });
    Object.keys(productsGroup).forEach((item) => {
      const baseProduct = productList.find((x) => x.name === item);
      items.soldProducts.push({
        _id: baseProduct._id,
        name: item,
        count: productsGroup[item],
        //image: baseProduct?.images?.length > 0 ? baseProduct.images[0] : ""
      })
    });
    items.soldProducts.sort((x1, x2) => x2.count - x1.count);


    res.status(200).json(items);

  } catch (error) {

    res.status(404).json({ message: error.message, stack: error.stack });

  }

}

export const getHomeGraph = async (req, res) => {

  try {

    let year = String(new Date().getFullYear());
    if ("year" in req.query) {
      year = req.query.year;
    };

    const month = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',       
    ];

    let data = [];

    for (let i = 0; i < month.length; i++) {

      const ordersRange = await OrderDB.aggregate([
        {
          "$match": {
            "$expr": {
              "$eq": [
                {
                  "$dateToString": { format: "%Y-%m", date: "$createdAt" }
                },
                year.concat('-', (i + 1) >= 10 ? String(i + 1) : '0'.concat(i + 1))
              ]
            }
          }
        }
      ]);

      data.push({
        name: month[i],
        value: ordersRange.reduce((a, b) => a + (b.total !== undefined ? b.total : 0), 0)
      })

    };

    res.status(200).json(data);

  } catch (error) {

    res.status(404).json({ message: error.message, stack: error.stack });

  }

}