const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            qty: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    subtotal:{
        type:Number,
        required:true
    },
    discountAmount:{
        type:Number,
        default:0,
        min:0
    },
    couponCode:{
        type:String,
        default:null
    },
    couponId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Coupon",
        default:null
    },
    address: {
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentId: { type: String, default: 'pending' },
    razorpayOrderId: { type: String },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);