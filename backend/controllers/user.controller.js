import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
const base = 'http://localhost:5999';
const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  const verificationUrl = `${base}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"DevBandhu" <noreply@yourapp.com>',
    to: user.email,
    subject: 'Verify your email address',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });
};

// Email Verification Route
const verifyEmail = async (req, res) => {
  const { token } = req.body;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Update the user's verification status in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email successfully verified!' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
const verifyResetPassword = asyncHandler( async (req, res) => {
	const { password, token } = req.body;
        
 	try {
   	 const decoded = jwt.verify(token, process.env.JWT_SECRET);
    	 const userId = decoded.userId;
    	const user = await User.findById(userId);
    	if (!user) {
      	return res.status(400).json({ message: 'Invalid token' });
    	}
		user.password = password
		await user.save({ validateBeforeSave: false })
		return res.status(200)
			.json( new ApiResponse(200, {}, "Password changed Successfully.."))
	} catch (error) {
		res.status(400).json({message: 'Invalid or expired token'})
	}
})
const sendResetPasswordEmail = async (user) => {
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});
	const verificationUrl = `${base}/reset-password=${token}`;

	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})
	try{
	await transporter.sendMail({
		from: '"DevBandhu" <noreply@devbandhu.in>',
		to: user.email,
		subject: 'Reset your Password',
		html: `<p><a href="${verificationUrl}"> Click here <a> to reset your email. <p> `
	});
	} catch(error){
		console.log(error)
	}
};
// Resend Verification Email
const resendVerificationEmail = async (req, res) => {
	if(req.user?.isVerified){
		return res.status(300)
			.json(new ApiResponse(300, {}, "User already verified."))
	}
	await sendVerificationEmail(req.user)
	return res.status(200)
		.json(new ApiResponse(200, {}, "Verification link resend."))
}

const generateAccessAndRefreshToken = async (userId) => {
	const user = await User.findById(userId)
	const accessToken = user.generateAccessToken()
	const refreshToken = user.generateRefreshToken()
	user.refreshToken = refreshToken
	await user.save({ validationBeforeSave: false })
	return { accessToken, refreshToken }
}

const registerUser = asyncHandler( async(req, res) => {
	// get user info
	const { username, fullName, email, password, skills } = req.body
	//Validate - not empty
	if(
		[username, email, fullName, password].some((field)=>field?.trim()==="")
	)
		throw new ApiError(401, "All fields are required..")
	// Check for the user if already existed
	const isExisted = await User.findOne({
		$or: [{username}, {email}]
	})
	if(isExisted){
		throw new ApiError(409, "User already existed..")
	}
	// otherwise moved on to registration part
	let avatarLocalPath = req.files?.avatar?.[0]?.path
	let avatar = await uploadOnCloudinary(avatarLocalPath)
	if(!avatar)
		avatar = { url: "https://dummyimage.com/300" };	
	
	
	// Now , it's time to create a new user
	const user = await User.create({
		fullName,
		email,
		password,
		username: username.toLowerCase(),
		avatar: avatar.url,
		skills: skills ?? []
	})
	// Check whether the user is created or not
	const isUserCreated = await User.findById(user._id).select("-password -refreshToken")
	if(!isUserCreated)
		throw new ApiError(500, "User not Created..")
	console.log("Before sending verification mail")
	await sendVerificationEmail(isUserCreated)
	console.log("after sending verification mail")
	return res.status(200)
		.json(new ApiResponse(200,{}, "User Created Successfully.." ))
})

const resetPassword = async (req, res) => {
	const { email } = req.body
	const isUserExisted = await User.findOne({email}).select("-password -refreshToken")
	if(!isUserExisted)
		return res.status(300).json(new ApiResponse(300, {}, "Email Existed"))
		//throw new ApiError(400, "Invalid email")
//	const token = jwt.sign({
//			userId: user._id },
//			process.env.JWT_SECRET,
//			{ expiresIn: '1h'
//			});
	await sendResetPasswordEmail(isUserExisted);
return res.status(200).json({ message: 'Reset password email sent successfully.' });
}
						
const login = asyncHandler(async (req, res) => {
	// Extract data from req url
	const { username, email, password } = req.body

	// Check wheater user is already login or not
			
	// Validation
	if (!(email || username) || !password)
		throw new ApiError(401, "Email or Password is required..")
	const user = await User.findOne({
	$or: [{username}, {email}]
	})
	if(!user)
		throw new ApiError(401, "Credentials are invalid..")

	// Check if password is correct
	const isPasswordCorrect = await user.isPasswordCorrect(password)
	if(!isPasswordCorrect)
		throw new ApiError(401, "Password is invalid..")
	// Now , everyrhing looks fine - if we reach upto this point
	// now we have a user -> only thing is to generate an access and refresh token
	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)
	// fetch user details to display - without password and refresh token
	const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
	// Set cookies and send data in response
	res.cookie("accessToken", accessToken, { httpOnly: true, secure: true })
	res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
	// send a res
	return res.status(200)
		.json(
			new ApiResponse(200, { user: loggedInUser, accessToken },
				"User logged in Successfully..")
		)
})

const logout = asyncHandler(async (req, res) => {
	const userId = req.user?._id
	await User.findByIdAndUpdate(userId,
	{
		$set: {
			refreshToken: undefined
		}
	}, 
		{
			new: true
		}
	)
	return res.status(200)
		.clearCookie("accessToken", { httpOnly: true, secure: true })
		.clearCookie("refreshToken", { httpOnly: true, secure: true})
		.json(new ApiResponse(200, {}, "Logout Successfully.."))
})

const changePassword = asyncHandler( async (req, res) => {
  	 const {oldPassword, newPassword} = req.body

   	const user = await User.findById(req.user?._id)
   	const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
   	if(!isPasswordCorrect)
        	throw new ApiError(401, "Invalid old Password")
    	// Now if everything is going right then we will update the password of our user
	user.password = newPassword
	await user.save({ validateBeforesave: false })
	return res.status(200)
		.json( new ApiResponse(200, {}, "Password chnaged Successfully.."))
})

const getUser = asyncHandler( async (req, res) => {
	const user = await User.findById(req.user?._id).select("-password -refreshToken")
	return res.status(200)
		.json( new ApiResponse(200, user, "Data fetched Successfully.."))
})

const getUserById = asyncHandler( async (req, res) => {
	if(!req.params.id){
		return res.status(200)
			.json(new ApiError(400, "Cannot get user without ID"))
	}
	const user = await User.findById(req.params.id).select("-password -refreshToken")
	return res.status(200)
		.json(new ApiResponse(200, user, "Data fetched successfully"))
})

const updateSkills = asyncHandler( async (req, res) => {
	const {skills} = req.body
	const newSkills = skills ? skills.split(",") : []
	if(newSkills.length === 0){
		return res.status(400)
			.json(new ApiResponse(400, {}, "No changes occurred.."))
	}
	const user = await User.findByIdAndUpdate(req.user?._id,{
		$set: {
			skills: newSkills
		}},
		{ new: true, runValidators: true }).select("-password -refreshToken")
	return res.status(200)
		.json(new ApiResponse(200, user, "Skills added Successfull.."))
})

export { registerUser, verifyEmail, resendVerificationEmail, resetPassword, verifyResetPassword, login, logout, changePassword, getUser, getUserById, updateSkills }
