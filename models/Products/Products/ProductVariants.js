const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");
const ProductVariantsSchema = new mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetails",
      required: true,
    },
    priceVariant: {
        type: Number,
        default: 0,
    },
    // variants: [{
    //     parameterId: {type: Schema.Types.ObjectId, ref: "ParameterMaster"},
    //     parameterValueId: {type: Schema.Types.ObjectId, ref: "ParameterValue"},
    // }],
    productVariants: [{
      type: Schema.Types.ObjectId,
      ref: "ParameterValue",
      required: true,
    }],
    isOutOfStock: {
        type: Boolean,
        default: false,
      },
      isSubscription: {
        type: Boolean,
        default: false,
      },
    IsActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductVariants", ProductVariantsSchema);


//PnC: small/a/hot, small/a/cold,small/a/iced, medium/b/hot, medium/b/cold, large/c/hot, large/d/hot,....
//size: small/medium/large/x-large/xx-large
//milk: a,b, c
//drink: hot, cold, iced
