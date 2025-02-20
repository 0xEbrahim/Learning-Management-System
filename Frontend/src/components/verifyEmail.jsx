import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [status, setStatus] = useState('Verifying');
  const [searchParams] = useSearchParams();
  const navigate=useNavigate();
  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token'); // Get token from URL
      if (!token) {
        setStatus('Invalid verification link.');
        return;
      }

      try {
        const response = await axios.get(`'https://learning-management-system-262s.onrender.com/api/v1/verify-Email`, { token });
        setStatus("Email verified, now you can login to your account.");
      } catch (error) {
        setStatus(error.response.data.message || 'Verification failed. Try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      <h2>{status}</h2>
      {status === 'Email verified successfully! You can now log in.' && (
        navigate("/login")
      )}
    </div>
  );
};

export default VerifyEmail;