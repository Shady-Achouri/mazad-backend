const mongoose = require("mongoose");
const {
  BRAND_TYPE,
  BRAND_MARKET,
  BRAND_SIZE,
  CHANNELS,
  GENDER,
  AGE_INTERVALS,
} = require("../static");
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [BRAND_TYPE.COMPANY, BRAND_TYPE.AGENCY, BRAND_TYPE.ASSOCIATION],
    },
    address: {
      type: String,
      enum: [BRAND_MARKET.B2B, BRAND_MARKET.B2C, BRAND_MARKET.B2B2C],
    },
    size: {
      type: String,
      enum: [
        BRAND_SIZE.ENTREPRENEUR,
        BRAND_SIZE.STARTUP,
        BRAND_SIZE.TPE,
        BRAND_SIZE.PME,
        BRAND_SIZE.ETI,
        BRAND_SIZE.GE,
      ],
    },
    sectors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sector",
      },
    ],
    website: {
      type: String,
    },
    logo: {
      type: String,
      default: "logos/no-logo.png",
    },
    history: {
      type: String,
    },
    vision: {
      type: String,
    },
    purpose: {
      type: String,
    },
    values: [
      {
        type: String,
      },
    ],
    commitments: [
      {
        type: String,
      },
    ],
    channels: [
      {
        type: String,
        enum: [
          CHANNELS.FACEBOOK,
          CHANNELS.INSTAGRAM,
          CHANNELS.TIKTOK,
          CHANNELS.YOUTUBE,
        ],
      },
    ],
    persona: {
      gender: {
        type: String,
        enum: [GENDER.MALE, GENDER.FEMALE, GENDER.NON_BINARY],
      },
      age: {
        type: String,
        enum: [
          AGE_INTERVALS["1824"],
          AGE_INTERVALS["2534"],
          AGE_INTERVALS["3544"],
          AGE_INTERVALS["4554"],
          AGE_INTERVALS["5564"],
          AGE_INTERVALS["65"],
        ],
      },
      geography: [
        {
          type: "String",
        },
      ],
    },
    tags: [
      {
        type: String,
      },
    ],
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);
