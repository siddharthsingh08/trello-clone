import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, user, loading } = useAuth();

   if (loading) {
     return (
       <div className="h-screen flex flex-col items-center justify-center">
         <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-current mb-4"></div>
         <p>Loading...</p>
       </div>
     );
   }

  if(user)
  {
    return <Navigate to="/boards" />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-pink-900">
      <div className="flex flex-col items-center justify-center bg-black rounded-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl text-white">Welcome to Trello!</h1>
          <h3 className="text-2xl text-white">Goto place to manage Projects</h3>
          <p className="text-lg text-gray-200">Please log in to continue.</p>
        </div>
        <button
          onClick={login}
          className="bg-blue-200 text-black px-6 py-3 rounded-lg font-bold cursor-pointer">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
