import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base } from '../../constant';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usernames, setUsernames] = useState([]);
    const [leader, setLeader] = useState('')
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`${base}/project/${projectId}`);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                setProject(result.data);
            } catch (err) {
                setError(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    const getUsernames = async (members) => {
        try {
            const memberNames = [];
            for (const memberId of members) {
                const res = await fetch(`${base}/user/${memberId}`, { // Fetch user by ID
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                memberNames.push(data.data.username);
            }
            setUsernames(memberNames);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUsernames([]); // Reset usernames on error
        }
    };

    const getLeader = async (id) => {
            try {
                const res = await fetch(`${base}/user/${id}`,{
                    method: 'GET',
                    credentials: 'include'
                });
                if (!res.ok) {
                    throw new Error(res.status);
                }
                const data = await res.json();
                setLeader(data.data.username);
            } catch (error) {
                console.error('Error fetching leader ', error)
            }
    }


    useEffect(() => {
        if (project && project.members && project.leader) {
            getUsernames(project.members);
            getLeader(project.leader);
            // Fetch usernames if members exist
        }
    }, [project]);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="project-details">
            {project ? (
                <>
                    <h1>{project.title}</h1>
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Leader:</strong> {leader}</p>
                    {/* Check if user is a owner of the project
                    or not */}

                    <p><strong>Members:</strong> 
                        {usernames.length > 0 ? (
                            usernames.map((username, index) => (
                                <span key={index}>{username}</span>
                            ))
                        ) : (
                            <span>No members found.</span>
                        )}
                    </p>
                    {/* Add more fields as needed */}
                </>
            ) : (
                <div>No project found.</div>
            )}
        </div>
    );
};

export default ProjectDetails;
