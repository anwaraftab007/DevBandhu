import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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
	return res.status(200)
		.json(new ApiResponse(200,{}, "User Created Successfully.." ))
})

const login = asyncHandler(async (req, res) => {
	// Extract data from req url
	const { username, email, password } = req.body
	// Debugging
	console.log(req.query)
	// Validation
	if (!(email && username) && !password)
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
	res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true})
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

export { registerUser, login, logout, changePassword, getUser, updateSkills }
