import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Project } from "../models/project.model.js"
import { User } from "../models/user.model.js"

const createProject = asyncHandler( async (req, res) => {
	const { title, description, skills } = req.query
	const trimSkills = skills ? skills.split(",") : []
	const leaderId = req.user._id
	if( !title || !description || !skills )
		throw new ApiError(400, "All fields are required..")

	// Check if project is existed with the same title already
	const existingProject = await Project.findOne({ title })
	if(existingProject)
		throw new ApiError(400, "Project with the same title existed already..")
	// otherwise create a new Project
	const newProject = await Project.create({
		title,
		description,
		skills: trimSkills,
		leader: leaderId,
		members: [leaderId]
	})

	await User.findByIdAndUpdate( leaderId, {
		$push: { projects: newProject }
	},	{ new: true })

	return res.status(200)
		.json(new ApiResponse(200, newProject, "Project created Successfully.."))
})

const joinProject = asyncHandler( async(req, res) => {
	const { projectId } = req.query
	const userId = req.user._id
	const project = await Project.findById(projectId)
	if(!project)
		throw new ApiError(400, "Project not Found..")
	// check if user already joined
	if(project.members.includes(userId))
		throw new ApiError(400, "User is already a part of this project..")
	// if not, then add the user to the pproject
	project.members.push(userId)
	await project.save()
	// Now update the user projects list
	await User.findByIdAndUpdate(userId, {
		$push: { projects: projectId }
	}, { new: true })

	return res.status(200)
		.json(new ApiResponse(200, project, "User successfully joined the project.."))
})

export { createProject, joinProject }
