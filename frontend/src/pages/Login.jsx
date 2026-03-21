import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BASE_URL from "../api";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Logging in...");

      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password
      });

      console.log("Login success:", res.data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.log("Login error:", err.response);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-8">Welcome Back</h2>

        {error && (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import BASE_URL from "../api";
// import axios from 'axios';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post($, { email, password });
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       if (res.data.user.role === 'admin') navigate('/admin');
//       else navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
//       <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
//         <h2 className="text-center mb-8">Welcome Back</h2>
//         {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label className="input-label" htmlFor="email">Email</label>
//             <input
//               className="input-field"
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label className="input-label" htmlFor="password">Password</label>
//             <input
//               className="input-field"
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-full mt-4">Login</button>
//         </form>
//         <p className="text-center mt-4">
//           <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
//           <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Sign Up</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
