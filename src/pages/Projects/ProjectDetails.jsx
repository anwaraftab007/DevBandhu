import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { base } from '../../constant';

const ProjectDetails = ({isLoggedIn, userId}) => {
    // console.log(userId)
    const [showModal, setShowModal] = useState(false);
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const projectId = queryParams.get("projectId")
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usernames, setUsernames] = useState([]);
    const [leader, setLeader] = useState('')
    const [isJoined, setIsJoined] = useState(false)
    const [error, setError] = useState('');
    const [message, setMessage] = useState('')
    const handleClick = async () => {
        if(!isLoggedIn){
            setMessage('You need to Register or Signin first!!')
            setShowModal(true)
            return;
        }
       try {
         const response = await fetch(`${base}/project/join/${projectId}`,{
             method: 'POST',
             headers: {
                 'Content-type': 'application/json'
             },
             credentials: 'include'
         })
         if (response.ok) {
             setMessage('Joined Successfully..')
             } else {
                if(response.status === 402){
                    setMessage('User is already  Part of this project..')
                }
                 }
       } catch (error) {
            console.error(error)
       }
    }
    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`${base}/project/${projectId}`);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                setProject(result.data);
                const joined = result.data.members.some(member => member === userId);
                setIsJoined(joined)
            } catch (err) {
                setError(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProjectDetails();
    }, [userId]);
    const closeModal = () => {
        setShowModal(false);
      };
    const getUsernames = async (members) => {
        try {
            const memberNames = [];
            for (const memberId of members) {
                const res = await fetch(`${base}/user/${memberId}`, {
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
            setUsernames([]);
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
                    
                {!isJoined && <button 
        onClick={handleClick} 
        type="submit" 
        className={`p-2 text-white text-lg rounded ${
          isLoggedIn ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Join..
      </button>}
                {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">You need to sign up or log in first!</h2>
            <button 
              className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
                </>
            ) : (
                <div>No project found.</div>
            )}
        </div>
    );
};

export default ProjectDetails;
