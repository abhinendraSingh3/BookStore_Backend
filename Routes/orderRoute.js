const express = require('express');
const orderRoute = express.Router();
const jwtAuthMiddleWare = require('./../jwtAuthMiddleWare')
const cart = require('./../Models/cart');
const order = require('./../Models/order')
const adminRoute = require('./../adminAuth')

orderRoute.post('/order', jwtAuthMiddleWare, async (req, res) => {
    try {
        const userId = req.data.userId;
        const userCart = await cart.findOne({ user: userId });
        const { order_status, payment_method, address } = req.body;

        if (!userCart || userCart.items.length === 0) {
            return res.status(404).json({ message: "user cart is empty" })
        }

        let totalamt = 0;

        userCart.items.forEach(i => (
            totalamt += i.quantity * i.price
        ))

        //create user order from cart
        const newOrder = await order.create({
            user: userId,
            items: userCart.items.map(i => ({
                book: i.book,
                quantity: i.quantity,

            })),
            order_total: totalamt,
            order_status: order_status,
            address: address,
            payment_method: payment_method
        })

        if (!newOrder) {
            return res.status(401).json({ message: "order not palced" })
        }

        return res.status(200).json({ order: newOrder, message: "Order successfull" })

    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });

    }
})

//---------- Show all orders of user-----------//

orderRoute.get('/order', jwtAuthMiddleWare, async (req, res) => {

    try {
        const userId = req.data.userId;
        //find- we will use it for finding multiple orders
        //findOne- we will use it for finding one order only
        const userOrders = (await order.find({ user: userId }).select('order_total order_status,address,payment_method')).sort({ createdAt: -1 });
        if (!userOrders || userOrders.length === 0) {
            return res.status(404).json({ message: "No orders" })
        }
        return res.status(200).json({ orders: userOrders, message: "Here is your orders" })

    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
})

//----------show single order---------//

orderRoute.get('/:orderid', jwtAuthMiddleWare, async (req, res) => {

    try {
        const orderId = req.params.orderid;
        const userId = req.data.userId; //extracting user data from jwt

        const userOrder = await order.findOne({
            _id: orderId,
            user: userId
        })

        if (!userOrder) {
            return res.status(404).json({ message: "order not found" })
        }

        return res.status(200).json({ order: userOrder, message: "Order fetched Successfully" })

    }

    catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

//---------update order by admin--------//
orderRoute.put('/:orderid', jwtAuthMiddleWare, adminRoute('admin'), async (req, res) => {
    try {
        //order status change

        //extract delivery status,from body, orderId from params
        const { order_status } = req.body;
        const orderId = req.params.orderid;

        const dbOrderStatus = await order.findById(orderId).select(order_status);

        if (!dbOrderStatus) {
            return res.status(404).json({ message: "Order not found" });
        }
        const status = dbOrderStatus.order_status; //we do this because findby.. always returns object andd .slect just trims the value part but it will still return an object with _id in it so thats why we need to do .order_status

        if (status === "pending") {
            if (order_status === "deliverd") {
                return res.status(405).json({ message: "Order status must be shipped" })
            }
        }

        if (status === "shipped") {
            if (order_status === "pending") {
                return res.status(405).json({ message: "Order status must be shipped" })
            }
        }

        //go to that by id and update and return updated data

        const dataUpdate = await order.findByIdAndUpdate(orderId, { order_status }, {
            runValidators: true,
            new: true
        });
        if (!dataUpdate) {
            return res.status(404).json({ message: "data not updated" })
        }
        return res.status(200).json({ data: dataUpdate, message: "Data updated" })

    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


// -------- cancel order by user -------- //
orderRoute.put('/:orderid/cancel', jwtAuthMiddleWare, async (req, res) => {
    try {
        const orderId = req.params.orderid;
        const userId = req.data.userId;

        const orderDoc = await order.findOne({
            _id: orderId,
            user: userId
        }).select('order_status');

        if (!orderDoc) {
            return res.status(404).json({ message: "Order not found" });
        }

        const status = orderDoc.order_status;

        // ❌ cannot cancel
        if (status === 'shipped' || status === 'delivered') {
            return res.status(405).json({
                message: "Order cannot be cancelled after shipping"
            });
        }

        // cancel allowed
        orderDoc.order_status = 'cancelled';
        await orderDoc.save();

        return res.status(200).json({
            message: "Order has been cancelled successfully"
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
