import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { AWSS3, AWSSES, PutObject, GOOGLE_GEOCODER, CLIENT_URL } from "../config.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";

export const uploadImage = async (req, res) => {
  try {
    // console.log(req.body);
    const { image } = req.body;

    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = image.split(";")[0].split("/")[1];

    const key = `${nanoid()}.${type}`;

    try {
      const result = await AWSS3.send(new PutObjectCommand({
        Bucket: "havenly-bucket",
        Key: key,
        Body: base64Image,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      }));

      res.send({
        location: `https://havenly-bucket.s3.amazonaws.com/${key}`
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }

  } catch (err) {
    console.log(err);
    res.json({ error: "Upload failed. Try again." });
  }
};

export const removeImage = async (req, res) => {
  try {
    const { Key, Bucket } = req.body;

    try {
      const result = await AWSS3.send(new DeleteObjectCommand({ Bucket, Key }));
      console.log("Delete result:", result); // Optional debugging
      res.send({ ok: true });
    } catch (err) {
      console.error("Error deleting image:", err);
      res.status(400).json({ error: "Нещо се обърка." });
    }
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  try {
    //console.log(req.body);
    const {photos, description, title, address, price, type, landsize} = req.body;
    if (!photos.length) {
      return res.json({error: "Въведете снимки"});
    }
    if (!price) {
      return res.json({error: "Въведете цена"});
    }
    if (!type) {
      return res.json({error: "Въведете вид на имота"});
    }
    if (!address) {
      return res.json({error: "Въведете адрес"});
    }
    if (!description) {
      return res.json({error: "Въведете описание"});
    }

    const geo = await GOOGLE_GEOCODER.geocode(address);
    //console.log("geo =>", geo);
    const ad = await new Ad({
      ...req.body,
      postedBy: req.user._id,
      location: {
        type: `Point`,
        coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
      },
      googleMap: geo,
      slug: slugify(`${title}-${address}-${price}-${nanoid(6)}`), 
    }).save();

    //make user role > Seller
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {role: "Seller" },
    },
    {new: true}
  );

  user.password = undefined;
  user.resetCode = undefined;

  res.json({
    ad,
    user,
  });
  } catch (err) {
    res.json({ error: "Нещо се обърка. Опитайте отново."});
    console.log(err);
  }
};

export const ads = async (req, res) => {
  try{
    const adsForSell = await Ad.find({action: "Sell"})
      .select("-googleMap -location")
      .sort({createdAt: -1 })
      .limit(12);

    const adsForRent = await Ad.find({action: "Rent"})
      .select("-googleMap -location")
      .sort({createdAt: -1 })
      .limit(12);

      res.json({ adsForSell, adsForRent });
  } catch (err) {
    console.log(err);
  }
};

export const read = async (req, res) => {
  try {
    const ad = await Ad.findOne({slug: req.params.slug}).populate(
      "postedBy",
      "name username email phone company photo"
    );

    const related = await Ad.find({
      _id: {$ne: ad._id},
      action: ad.action,
      type: ad.type,
      address: {
        $regex: ad.googleMap[0]?.city || "", 
        $options: "i",
      },
    }).limit(3).select("-googleMap");

    res.json({ad, related});
  } catch (err) {
    console.log(err);
  }
};

export const addToWishlist = async (req, res) => {
  try{
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {wishlist: req.body.adId},
    }, {new: true}
  );
  const {password, resetCode, ...rest} = user._doc;
  res.json(rest);
  } catch (err) {
    console.log(err);
  }
};

export const removeFromWishlist = async (req, res) => {
  try{
    const user = await User.findByIdAndUpdate(
      req.user._id, {
      $pull: {wishlist: req.params.adId},
    }, 
      {new: true}
  );
  const {password, resetCode, ...rest} = user._doc;
  res.json(rest);
  } catch (err) {
    console.log(err);
  }
};

export const contactSeller = async (req, res) => {
  try {
    const {name, email, message, phone, adId} = req.body;
    const ad = await Ad.findById(adId).populate("postedBy", "email");

    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {enquiredProperties: adId},
    });
    
    if(!user) {
      return res.json({error: "Не намерихме потребител с този имейл адрес."});
    } else {
      const emailParams = {
        Destination: {
          ToAddresses: [ad.postedBy.email],
        },
        Message: {
          Body: {
            Html: {
              Data: `
                <p>Имате ново запитване</p>
                <h4>Детайли за клиента</h4>
                <p>Име: ${name}</p>
                <p>Имейл: ${email}</p>
                <p>Телефонен номер: ${phone}</p>
                <p>Съобщение: ${message}</p>
                <a href="${CLIENT_URL}/ad/${ad.slug}">${ad.title} в ${ad.address} с цена ${ad.price}</a>
              `,
            },
          },
          Subject: {
            Data: "Запитване за обява",
          },
        },
        Source: email,
        ReplyToAddresses: [email],
      };
      //send email
       try {
            const sendEmailCommand = new SendEmailCommand(emailParams);
            const data = await AWSSES.send(sendEmailCommand);
            console.log("Email sent successfully:", data);
            return res.json({ ok: true });
          } catch (err) {
            console.error("Error sending email:", err);
            return res.json({ ok: false, error: "Имейлът не се изпрати. Опитайте отново." });
          }
    }
  } catch (err) {
    console.log(err);
  }
};

export const userAds = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;

    const total = await Ad.find({ postedBy: req.user._id });

    const ads = await Ad.find({ postedBy: req.user._id })
      .populate("postedBy", "name email username phone company")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json({ ads, total: total.length });
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try{
    const {photos, price, type, address, description} = req.body;
    
    const ad = await Ad.findById(req.params._id);

    const owner = req.user._id == ad?.postedBy;

    if(!owner){
      return res.json({error: "Нямате разрешение"});
    } else {
      //validation
      if(!photos.length) {
        return res.json({error: "Сложете снимки"});
      }
      if(!price) {
        return res.json({error: "Въведете цена"});
      }
      if(!type) {
        return res.json({error: "Въведете вид на имота"});
      }
      if(!address) {
        return res.json({error: "Въведете адрес"});
      }
      if(!description) {
        return res.json({error: "Въведете описание"});
      }

      const geo = await GOOGLE_GEOCODER.geocode(address);

      ad.set({
        ...req.body,
        slug: ad.slug,
        location: {
          type: "Point",
          coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
        },
      });
      await ad.save();

      res.json({ok:true});
    }
  } catch (err) {
    console.log(err);
  }
};

export const enquiredProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.enquiredProperties }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const wishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.wishlist }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try{
    const ad = await Ad.findById(req.params._id);
    const owner = req.user._id == ad?.postedBy;
 
    if(!owner){
      return res.json({error: "Нямате разрешение"});
    } else {
      await Ad.findByIdAndDelete(ad._id);
      res.json({ok:true});
    }
  } catch(err) {
    console.log(err);
  }
};

export const adsForSale = async (req, res) => {
  try{
    const ads = await Ad.find({action: "Sell"})
      .select("-googleMap -location")
      .sort({createdAt: -1 })
      .limit(24);

      res.json(ads);
  } catch (err) {
    console.log(err);
  }
};
export const adsForRent = async (req, res) => {
  try{
    const ads = await Ad.find({action: "Rent"})
      .select("-googleMap -location")
      .sort({createdAt: -1 })
      .limit(24);

      res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const search = async (req, res) => {
  try {
    console.log("req query", req.query);
    const { action, address, type, priceRange } = req.query;

    const geo = await GOOGLE_GEOCODER.geocode(address);
    // console.log("geo => ", geo);

    const ads = await Ad.find({
      action: action === "Buy" ? "Sell" : "Rent",
      type,
      price: {
        $gte: parseInt(priceRange[0]),
        $lte: parseInt(priceRange[1]),
      },
      location: {
        $near: {
          $maxDistance: 20000, // 1000m = 1km
          $geometry: {
            type: "Point",
            coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
          },
        },
      },
    })
      .limit(24)
      .sort({ createdAt: -1 })
      .select(
        "-location -googleMap"
      );
    // console.log(ads);
    res.json(ads);
  } catch (err) {
    console.log();
  }
};