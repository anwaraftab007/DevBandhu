import React from 'react'
import { base } from '../constant';

const ProjectCard = ({ project, index }) => {
    
    return (
        <div key={index} className='max-w-[285px] max-h-[380px] bg-blue-600 text-white text-lg p-4 rounded-xl shadow-lg'>
            <div className="wrapper flex flex-col">
                <h1 className='text-2xl py-2 font-semibold'>Project {index+1}</h1>
                <p>Title: {project.title}</p>
                <p>Description: {project.description}</p>
                <p>Skills: {project.skills}</p>
            </div>
        </div>
    );
};


export default ProjectCard