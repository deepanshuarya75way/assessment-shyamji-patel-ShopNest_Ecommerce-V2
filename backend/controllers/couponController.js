const Coupon=require("../model/Coupon");
exports.validateCoupon=async(req,res)=>{
  try{
    const{code,cartTotal}=req.body||{};
    if(!code||cartTotal==null){
      return res.status(400).json({
        message:"Coupon code and cart total are required"
      });
    }
    const total=Number(cartTotal);
    if(!code||!Number.isFinite(total)||total<=0){
      return res.status(400).json({
        message:"Valid coupon code and cart total requireds"
      });
    }
    const coupon=await Coupon.findOne({
      code:String(code).trim().toUpperCase()
    });
    if(!coupon||!coupon.isActive){
      return res.status(400).json({
        message:"Invalid coupon code"
      });
    }
    if(new Date()>=coupon.expiryDate){
      return res.status(400).json({
        message:"Coupon has expired"
      });
    }
    if(coupon.usedCount>=coupon.usageLimit){
      return res.status(400).json({
        message:"Coupon usage limit reached"
      });
    }
    if(total<coupon.minOrderAmount){
      return res.status(400).json({
        message:`Minimun order amount is ${coupon.minOrderAmount}`
      });
    }
    const discount=coupon.discountType==="persentage"?total*coupon.discountValue/100:coupon.discountValue;
    const finalDiscount=Math.min(total,discount);
    return res.json({
      valid:true,
      code:coupon.code,
      discount:finalDiscount,
      finalTotal:total-finalDiscount
    });
  }
  catch(error){
    return res.status(500).json({
      message:error.message
    });
  }
};