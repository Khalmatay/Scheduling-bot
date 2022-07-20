import React, { useState } from "react"
import { useForm } from 'react-hook-form';
import SchedulingService from "../../http/schedulingService";
export default function ({afterSignIn}) {
  let [authMode, setAuthMode] = useState("signin")
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }
  


  const[itemToDo,setItemToDo]=useState("")
  const handleChangeItem = (event) => { // принимает событие (автоматически) 
    setItemToDo(event.target.value); // меняет значение инпута на то что пишем
  }; 
  console.log(itemToDo)
  

 
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();


  const onSubmit = async (data) => {
    
    console.log('dsfsdfsdf', data);
    const token = await SchedulingService.login(data)
    localStorage.setItem('token', token.refreshToken)
    console.log(token)
    afterSignIn()
  };


  if (authMode === "signin") {
    return (
      <div className="Auth-form-container first" >
        <form className="Auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
		            onChange={handleChangeItem} // стандартный вызов функции
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                 {...register("password", { required: true })}
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={handleChangeItem} 
              />
            </div>
            <div className="d-grid gap-2 mt-3">
           
                <button type="submit" className="btn btn-primary" >
                Submit
                </button>
                {/* <input class="btn btn-primary" type="submit" value="Submit">Submit</input> */}
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              {...register("nickName", { required: true })}
              type="text"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              onChange={handleChangeItem} 
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
               {...register("email", { required: true })}
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              onChange={handleChangeItem} 
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={handleChangeItem} 
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            
            <button type="submit" className="btn btn-primary" onClick={changeAuthMode}>
            Submit
            </button>
            {/* <input class="btn btn-primary" type="submit" value="Submit">Submit</input> */}
            
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  )
}
