import React, { useEffect, useState } from 'react'
import { base } from '../constant'
import { useLocation, useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {

      try {
        const res = await fetch(`${base}/user/verifyEmail`, {
          method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token})
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || 'Something went wrong');
          navigate('/');
          return;
        }

        alert(data.message || 'Email successfully verified!');
        setLoading(false);
        navigate('/'); // Navigate to profile after verification
      } catch (error) {
        console.error('Error verifying email:', error);
        alert('An error occurred while verifying email');
        navigate('/');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Email Verified...</p>}
    </div>
  );
};

export default VerifyEmail;