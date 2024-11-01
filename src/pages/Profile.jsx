import React, { useState, useEffect } from 'react';
import { base } from '../constant';
import ProjectCard from '../components/ProjectCard';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [pnf, setPnf] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await fetch(`${base}/user`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                if(response.status === 401)
                    navigate('/')
                throw new Error(`Error: ${response.statusText || 'Failed to fetch user data'}`);
            }

            const data = await response.json();
            setUser(data.data);

            // Only fetch projects if user.projects is defined and is an array
            if (data.data.projects) {
                await getProjects(data.data.projects);
            }
        } catch (error) {
            setPnf(true);
            console.error("Error fetching user data: ", error);
        }
    };

    const getProjects = async (projectIds) => {
        try {
            const projectData = [];

            for (const projectid of projectIds) {
                const response = await fetch(`${base}/project/${projectid}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText || 'Failed to fetch project data'}`);
                }

                const data = await response.json();
                projectData.push(data.data);
                 // Accumulate project data
            }

            setProjects(projectData);
        } catch (error) {
            console.error("Error fetching projects: ", error);
            setProjects([]);
        }
    };

    const handleResendVerificationEmail = async () => {
        const res = await fetch(`${base}/user/resendVerificationEmail`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        if (!res.ok) {
            alert(res.message || 'Error while sending verification email..')
            return;
        }
        const data = await res.json()
        if (data.success) {
            alert('Verification email sent successfully')
        }
    }

    const Info = (user) => {
        return (
            <div className="w-full h-screen bg-slate-900 text-white text-3xl flex flex-col space-y-4 justify-center items-center">
                {!user.isVerified && (
                    <button onClick={handleResendVerificationEmail} className="p-4 bg-blue-600 text-white font-bold text-2xl">
                        Resend Verification Email
                    </button>
                )}
                <h1>Full Name: {user.fullName}</h1>
                <h1>Username: {user.username}</h1>
                <h1>Email: {user.email}</h1>
                <h1>Joined Project: {projects.length === 0 && "No projects found"}</h1>
                {projects && projects.map((project, index) => (
                    <Link to={`/project?projectId=${project._id}`} 
                    key={index}>
                       <ProjectCard
                        project={project}
                        index={index}
                    /> 
                    </Link>
                    
                ))}
            </div>
        );
    };

    return (
        <div>
            {user ? (
                <div>
                    {Info(user)}
                </div>
            ) : (
                !pnf && <h1>Loading...</h1>
            )}
            {pnf && <h1>Page Not Found</h1>}
        </div>
    );
};

export default Profile;
