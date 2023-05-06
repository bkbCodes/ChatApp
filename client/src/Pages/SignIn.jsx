import React, { useContext } from "react";
import axios from "axios";
import { MyContext } from "../Context/ChatContext";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();
    
    const {userId, userName, authToken, setUserId, setUserName, setAuthToken} = useContext(MyContext)
    const handleSubmit = async e => {
        e.preventDefault();
        const username = document.getElementById('uname').value
        const password = document.getElementById('pass').value
        await axios.post("/user/login", {username: username, password: password})
        .then(res => {
            if(!res.data.id || !res.data.authToken)
              return 
            setUserId(res.data.id)
            setUserName(username)
            setAuthToken(res.data.authToken)
            
            console.log(userId, userName, authToken)
            alert("User Created Successfully")
            navigate("/app");
        })
          .catch(err => {alert(err)});
    }
  return (
    <div className="w-full h-[100vh] bg-slate-900 text-slate-200">
      <h1 className="text-2xl font-bold text-center py-4 mb-8">Login</h1>
      <form className="w-1/3 min-w-[330px] m-auto flex flex-col gap-4 border rounded-md p-10 shadow-lg shadow-slate-700" onSubmit={handleSubmit}>
        <div className="flex gap-4 w-full bg-slate-200 shadow-inner px-4 py-2 rounded-full text-black">
          <label htmlFor="uname">Username</label>
          <input
            type="text"
            name="uname"
            id="uname"
            className="flex-auto outline-none bg-transparent"
            required
          />
        </div>
        <div className="flex gap-4 w-full bg-slate-200 shadow-inner px-4 py-2 rounded-full text-black">
          <label htmlFor="pass">Password</label>
          <input
            type="password"
            name="pass"
            id="pass"
            className="flex-auto outline-none bg-transparent"
            required
          />
        </div>
        <input type="submit" value="Login" className="rounded-md bg-green-600 p-2"/>
        <Link to="/register" className="text-slate-500 underline m-auto">
            Don't have an Account?
        </Link>
      </form>
    </div>
  );
}

export default SignIn