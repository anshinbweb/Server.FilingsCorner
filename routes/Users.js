const express = require("express");

const router = express.Router();
const nodemailer = require('nodemailer');
const resetTokens = {};
let expire=false;

const catchAsync = require("../utils/catchAsync");
const {
  createUsers,
  SendOTP,
  listUsers,
  listUsersByParams,
  getUsers,
  updateUsers,
  removeUsers,
  userLogin,
  ChangePasswordUser,
  updateDefaultAddress,
  ResendOTP
} = require("../controllers/Auth/User/Users");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/userImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

const deleteOTP = (email) => {
  if (resetTokens[email]) {
    delete resetTokens[email];
    console.log(`OTP for ${email} expired.`);
  }
};

// Function to clean up expired OTPs every 5 minutes
const cleanupExpiredOTPs = async(req,res) => {
  const currentTime = Date.now();

  for (const email in resetTokens) {
    const { timestamp } = resetTokens[email];
    const elapsedTime = currentTime - timestamp;

    // Adjust the time threshold as needed (5 minutes = 300,000 milliseconds)
    if (elapsedTime > 60000) {
      expire=true;
    }
  }

  // Schedule the next cleanup after 5 minutes
  setTimeout(cleanupExpiredOTPs, 60000);
};

// Start the initial cleanup
cleanupExpiredOTPs();

// router.post(
//   "/auth/create/users",
//   upload.single("myFile"),
//   async(req, res) => {
//     const otp = generateOTP(6);
//     console.log("otp is",otp);
//     let {
//       firstName,
//       lastName,
//       contactNo,
//       email,
//       password,
//       IsActive,
//       IsPublic,
//       followers,
//       following,
//       cart,
//       defaultShippingAddress,
//       defaultBillingAddress,
//       shippingAddress,
//       billingAddress,
//     } = req.body;
//     console.log("email!",email);
//     const emailExists = await Users.findOne({
//       email: email,
//     }).exec();
//     if (emailExists) {
//       return res.status(200).json({
//         isOk: false,
//         message: "Email already exists",
//       });
//     }
//     else{
//     resetTokens[email] = {
//       otp: otp,
//       timestamp: Date.now(),
//     };
//     const savedOTPData = resetTokens[email];
//     const currentTime = Date.now();
//     const otpTimestamp = savedOTPData.timestamp;
//     const timeDifference = currentTime - otpTimestamp;
//     const validityTime = 5 * 60 * 1000; // 5 minutes in milliseconds

//     if (timeDifference > validityTime) {
      
//       return res.status(400).json({ message: 'OTP has expired' });
//     }
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'dhruvshah232002@gmail.com',
//         pass: 'paum zfsl wuxc asul',
//       },
//     });
    
//     // Check if the email exists in the dummy database
 
//     const user=Users.findOne({ email: req.body.email}).exec()
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Generate OTP
   
    
    
//     // Send the password reset email
//     const mailOptions = {
//       from: 'dhruvshah232002@gmail.com',
//       to: email,
//       subject: 'OTP Verification',
//       text: ` Your OTP is: ${otp}`,
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to send reset email' });
//       }
  
//       console.log('Email sent: ' + info.response);
//       return res.status(200).json({
//         isOk: true,
//       });
//     });
//   }})
router.post(
  "/auth/create/users",
     upload.single("myFile"),
    catchAsync(createUsers));
router.post("/auth/otp/users",upload.single("myFile"),catchAsync(SendOTP));
  // router.post("/auth/otp/users",upload.single("myFile"),async(req, res) => {
  //     try {
  //       // Access resetTokens data in the verification route
  //       let userImage = req.file ? `uploads/userImages/${req.file.filename}` : null;
  //       let {
  //         firstName,
  //         lastName,
  //         contactNo,
  //         email,
  //         password,
  //         IsActive,
  //         IsPublic,
  //         followers,
  //         following,
  //         cart,
  //         defaultShippingAddress,
  //         defaultBillingAddress,
  //         shippingAddress,
  //         billingAddress,
  //         otp
  //       } = req.body;
  //       const otpNumber = parseInt(resetTokens[email].otp , 10);
  //       const userotp = parseInt(otp , 10);
  //       console.log("email",email);
  //       console.log("user entered otp isss",otp);
  //       console.log('resetTokens data are:', resetTokens);
  //       console.log("otptpttp isss",otpNumber);
  //       console.log("otptpttp user isss",userotp);

  //         if (userotp===otpNumber && !isExpired(resetTokens[email].timestamp)) {
  //         // If OTP matches, consider it verified
  //         try{
  //           const add = await new Users({
  //             firstName: firstName,
  //             lastName: lastName,
  //             email: email,
  //             password: password,
  //             contactNo: contactNo,
  //             IsActive: IsActive,
  //             IsPublic: IsPublic,
  //             defaultShippingAddress: defaultShippingAddress,
  //             defaultBillingAddress: defaultBillingAddress,
  //             shippingAddress: shippingAddress,
  //             billingAddress: billingAddress,
  //             userImage: userImage,
              
  //           }).save();
  //           delete resetTokens[email];
        
  //       }
  //       catch(err){
  //         console.log("error creating account",err);
  //       }
  //         res.status(200).json({
  //           isVerified: true,
  //           email: email
  //         });
  //       } else {
  //         // If OTP does not match or resetToken not found, consider it not verified
  //         res.status(200).json({
  //           isVerified: false,
  //           email: email
  //         });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ message: 'Internal server error' });
  //     }
  //   });
  

  
  // Function to check if a timestamp is expired (2 minutes = 120,000 milliseconds)
  const isExpired = (timestamp) => {
    const expirationTime = 90000; // 2 minutes
    return Date.now() - timestamp > expirationTime;
  };
 console.log(resetTokens);

router.post("/auth/user-change-password", catchAsync(ChangePasswordUser));

router.get("/auth/list/users", catchAsync(listUsers));

router.post("/auth/list-by-params/users", catchAsync(listUsersByParams));

router.get("/auth/get/users/:_id", catchAsync(getUsers));

router.put(
  "/auth/update/users/:_id",
  upload.single("myFile"),
  catchAsync(updateUsers)
);

router.post(
  "/auth/update-defualt-address/:userId/:addressId",
  catchAsync(updateDefaultAddress)
);
router.post('/auth/resend-otp/users',upload.single("myFile"), catchAsync(ResendOTP));



router.delete("/auth/remove/users/:_id", catchAsync(removeUsers));

router.post("/login", catchAsync(userLogin));

module.exports = router;
