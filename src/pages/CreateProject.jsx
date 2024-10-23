import React, { useState } from 'react';
import { base } from '../constant'; // Base URL for the API
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [customSkill, setCustomSkill] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    // Predefined skill options
    const skillOptions = [
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "Java",
        "CSS",
        "HTML",
        "SQL",
        "MongoDB",
        "Others" // Last option allows custom skills
    ];

    // Handle skill selection change
    const handleSkillChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedSkills(selected);
    };
    const handleSubmit = async () => {
        setMessage(null);
        setError(null);
        let finalSkills = [...selectedSkills];
        if (selectedSkills.includes("Others") && customSkill) {
            finalSkills.push(customSkill);
        }
        finalSkills = finalSkills.filter(skill => skill !== "Others" || customSkill);
        if (!projectName || !projectDescription || finalSkills.length === 0) {
            setError("All fields are required, including at least one skill.");
            return;
        }
        const body = {
            title: projectName,
            description: projectDescription,
            skills: finalSkills
        };

        try {
            const response = await fetch(`${base}/project/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create project.');
            }

            setMessage("Project created successfully.");
            setProjectName('');
            setProjectDescription('');
            setSelectedSkills([]);
            setCustomSkill('');
            navigate('/profile')
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="create-project-form">
            <h1>Create a New Project</h1>
            <div>
                <label>Project Name:</label>
                <input
                    type="text"
                    name="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <br />
                <label>Project Description:</label>
                <textarea
                    name="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                />
                <br />
                <label>Project Skills:</label>
                <br />
                <select multiple value={selectedSkills} onChange={handleSkillChange}>
                    {skillOptions.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <br />
                {/* Show input field for custom skill if "Others" is selected */}
                {selectedSkills.includes("Others") && (
                    <>
                        <label>Other Skill:</label>
                        <input
                            type="text"
                            name="customSkill"
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                        />
                    </>
                )}
                <br />
                <button  onClick={handleSubmit}>Create Project</button>
            </div>

            {/* Display success or error message */}
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreateProject;
