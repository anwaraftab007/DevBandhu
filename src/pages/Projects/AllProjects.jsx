import React, {useEffect, useState} from 'react'
import { base } from '../../constant'
import ProjectCard from '../../components/ProjectCard'
import { Link } from 'react-router-dom'

const AllProjects = () => {
  const [projects, setProjects] = useState([])
  const [message, setMessage] = useState('')
  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${base}/project`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            
            setProjects(data.data);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    fetchProjects();
}, []);

  
  return (
    <div className='w-full flex flex-row gap-4 m-4 max-sm:flex-col justify-around items-center'>
      {projects && projects.map((project, index) => {
      return (
        <Link to={`/project?projectId=${project._id}`} key={index}>
        <ProjectCard 
        index={index}
        project={project}
        />
        </Link>
      )
    })}
    </div>
  )
}

export default AllProjects