import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {token} =useParams(); // Get token from URL
  console.log(token);
  const [status, setStatus] = useState('Verifying');
  const navigate=useNavigate();
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('Invalid verification link.');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/auth/Verify-Email/${token}`);
        setStatus("Email verified, now you can login to your account.");
      } catch (error) {
        setStatus(error.response.data.message || 'Verification failed. Try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h2>{status}</h2>
      {status === "Email verified, now you can login to your account." && (
        navigate("/login")
      )}
    </div>
  );
};

export default VerifyEmail;