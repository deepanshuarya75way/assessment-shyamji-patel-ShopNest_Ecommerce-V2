const Order = require('../model/Order');

// NOTE: Orders are no longer created directly through this controller.
// An order is created as "pending" in paymentController.createdOrder,
// and only confirmed (status -> 'processing', stock decremented) in
// paymentController.verifyPayment after Razorpay signature verification.
// This prevents a client from creating a paid-looking order without
// actually paying, or with a manipulated amount.

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.productId', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').populate('items.productId', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
const updateOrderStatus =async(req, res) => {
    try{
        const {status} =req.body;
        const order = await Order.findById(req.params.id);
        if(order){
            order.status =status;
            await order.save();
            res.json({message:'Order status updated', order});
        }
        else{
            res.status(404).json({message: 'Order not found'});
        }
    }catch(error){
        res.status(500).json({message: 'Error updating order status',error});
    }
};

module.exports = {
    myOrders,
    getOrders,
    updateOrderStatus,
};
        