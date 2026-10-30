const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/Order");
const Product = require("../model/Product");
const sendEmail = require("../utils/sendEmail");

// STEP 1: Create a Razorpay order + a matching "pending" Order in our DB.
// We NEVER trust the price/amount sent by the client — we always look up
// the real product price from the database.
const createdOrder = async (req, res) => {
    try {
        const { items, address } = req.body;

        if (!items || items.length === 0 || !address) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        let totalAmount = 0;
        const formattedItems = [];

        for (const item of items) {
            const productId = item.productId || item._id;
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: `Product not found` });
            }
            if (product.stock < item.qty) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Only ${product.stock} left.` });
            }

            totalAmount += product.price * item.qty;
            formattedItems.push({
                productId: product._id,
                qty: item.qty,
                price: product.price
            });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(totalAmount * 100), // paise, calculated from DB prices only
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const razorpayOrder = await instance.orders.create(options);

        // Save a "pending" order in our own DB, linked to the Razorpay order id.
        // Nothing is confirmed and NO stock is touched yet.
        const order = new Order({
            user: req.user._id,
            items: formattedItems,
            totalAmount,
            address,
            razorpayOrderId: razorpayOrder.id,
            status: "pending"
        });
        await order.save();

        res.status(200).json({
            razorpayOrder,
            dbOrderId: order._id,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// STEP 2: Verify the Razorpay signature, then — and only then — mark the
// matching DB order as paid and decrement stock. This is the only place
// an order is ever confirmed. Nothing the client sends is trusted except
// the signed Razorpay response.
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment details" });
        }

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== "pending") {
            // Prevents this endpoint being replayed to re-trigger stock deduction/emails
            return res.status(400).json({ message: "This order was already processed" });
        }

        // Re-check stock at confirmation time too (in case it changed between
        // order creation and payment), then decrement it.
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.qty) {
                return res.status(409).json({ message: "One or more items went out of stock during checkout" });
            }
        }
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } });
        }

        order.paymentId = razorpay_payment_id;
        order.status = "processing";
        await order.save();

        try {
            const message = `Dear ${req.user.name},

Thank you for your order! We're happy to confirm that your order has been placed successfully with ShopNest.

Order Summary:
- Total Amount: Rs.${order.totalAmount}
- Shipping Address: ${order.address.street}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}
- Payment ID: ${order.paymentId}

We're preparing your order for shipment and will notify you once it's on its way.

Warm regards,
Team ShopNest`;
            await sendEmail(req.user.email, "Order Confirmed", message);
        } catch (emailErr) {
            // Don't fail the whole request just because the confirmation email didn't send
            console.error("Order confirmation email failed:", emailErr.message);
        }

        res.status(200).json({ message: "Payment verified successfully", order });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createdOrder, verifyPayment };
