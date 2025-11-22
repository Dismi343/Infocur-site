
import owl from '../assets/owl.png';
import {useState} from "react";
import { useNavigate,useLocation } from 'react-router-dom';
import axios from "axios";

function AdminLogin(){

    const navigate = useNavigate();
    const location = useLocation();

    const [message, setMessage] = useState('');
    const [userName,setUserName] =useState('');
    const [password,setPassword]=useState('');

    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/dashboard";



    const handleLogin = async(e) => {
            e.preventDefault();
        try{
            const res = await axios.post("auth/admin/login", {
                username: userName,
                password: password,
                withCredentials: true  // important for Spring session
            });

            navigate('/dashboard');
            navigate(next);
            console.log('User:', res.data.data);
        }catch(e){
            console.error(e);
            setMessage('Invalid RegNumber or password');
        }
    }

    return(
        <>
            <div className="py-10 bg-neutral-800 flex justify-center items-center min-h-screen">
                <div className="flex flex-col md:flex-row w-full max-w-[900px] rounded-xl overflow-hidden shadow-lg font-sora mx-4 mt-20">

                    {/* Left side */}
                    <div className="bg-[#D9D9D9] flex flex-col items-center justify-center px-6 py-8 md:px-8 md:py-0 md:w-1/2">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#2682C1] mt-4 mb-4 font-sora text-center">WELCOME</h1>
                        <img src={owl} alt="Owl with Camera" className="w-[200px] md:w-[250px] h-auto object-contain" />
                    </div>

                    {/* Right side */}
                    <div className="bg-[#979797] flex flex-col py-8 px-6 md:px-10 md:w-1/2">
                        <div className='flex flex-col justify-center items-center'>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">LOGIN</h2>
                            <h2 className="text-2xl md:text-2xl font-bold text-gray-100 mb-8">Admin Dashboard</h2>
                        </div>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Registration Number"
                                className="p-2 mb-4 rounded bg-[#D9D9D9] w-full font-semibold text-black"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="p-2 mb-4 rounded bg-[#D9D9D9] w-full font-semibold text-black"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />



                            <div className='flex flex-col mt-4 items-center'>
                                <button className="bg-[#2682C1] font-semibold text-white py-2 rounded-2xl w-full md:w-[175px] mb-4" type="submit">
                                    Login
                                </button>
                            </div>
                        </form>
                        {message && <p className="text-rose-800 text-center mt-2 text-sm">{message}</p>}

                    </div>
                </div>
            </div>
        </>
    );
}
export default AdminLogin;