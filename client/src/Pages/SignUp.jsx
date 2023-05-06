import React, { useContext } from "react";
import axios from "axios";
import { MyContext } from "../Context/ChatContext";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    const {setUserId, setUserName, setAuthToken} = useContext(MyContext)
    const handleSubmit = async e => {
        e.preventDefault();
        const username = document.getElementById('uname').value
        const password = document.getElementById('pass').value
        axios.post("/user/signup", {username: username, password: password})
        .then(res => {
            setUserId(res.data.id)
            setUserName(username)
            setAuthToken(res.data.authToken)
            
            alert("User Created Successfully")
            navigate("/login")
        })
          .catch(err => {alert(err)});
    }
  return (
    <div className="w-full h-[100vh] bg-slate-900 text-slate-200">
      <h1 className="text-2xl font-bold text-center py-4 mb-8">Register</h1>
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
        <div className="flex gap-2 items-baseline px-4">
          <input type="checkbox" name="agree" id="agree" required className="outline-none"/>
          <label htmlFor="agree">I agree with <span className="underline text-slate-500">Terms & Condition</span></label>
        </div>
        <input type="submit" value="Register" className="rounded-md bg-green-600 p-2"/>
        <Link to="/login" className="text-slate-500 underline m-auto">
            Already have account?
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
