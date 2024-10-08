import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
		console.log(`MognoDb COnnected Successfully, : ${connectionInstance.connection.host}`);
	} catch (err){
		console.error("Err: ", err);
		process.exit(1);
	}
}
export default connectDB;
