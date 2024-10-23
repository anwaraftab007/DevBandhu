import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},
	username: {
	type: String,
	required: true,
	unique: true,
	trim: true,
	index: true
	},
	email: {
	type: String,
	required: true,
	unique: true
	},
	password: {
	type: String,
	required: [true, "pass is required."]
	},
	skills: {
	type: [String],
	enum: ['React', 'HTML', 'Javascript', 'CSS', 'Node.js', 'SpringBoot', 'Python', 'Machine Learning', 'Java', 'Other']
	},
	avatar: {
	type: String	// Cloudinary url
	},
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}],
	refreshToken: {
	type: String
	},
	isVerified: {
		type: Boolean,
		default: false
	}
	},
	{timestamps: true});
userSchema.pre("save", async function(next){
	if(this.isModified("password")){
		this.password = await bcrypt.hash(this.password, 10)
		next();
	}
})
userSchema.methods.isPasswordCorrect = async function(password){
		return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function (){
	return jwt.sign({
		_id: this._id,
		email: this.email,
		username: this.username,
		fullName: this.fullName
	},
		process.env.ACCESS_TOKEN_SECRET,
	{
		expiresIn: process.env.ACCESS_TOKEN_EXPIRY
	})
}
userSchema.methods.generateRefreshToken = function (){
	return jwt.sign({
		_id: this._id
	},
		process.env.REFRESH_TOKEN_SECRET,
	{
		expiresIn: process.env.REFRESH_TOKEN_EXPIRY
	})
}
export const User = mongoose.model("User", userSchema);
