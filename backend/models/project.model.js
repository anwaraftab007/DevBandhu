import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
	leader: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	members: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	title: {	
		type: String,
		unique: true,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	skills: {
		type: [String],
		enum: [
        		"React",
        		"HTML",
        		"JavaScript",
        		"CSS",
        		"Node.js",
        		"Python",
        		"Java",
        		"Other",
		],
		required: true
	}
	}, {timestamps: true});

export const Project = mongoose.model('Project', projectSchema);
