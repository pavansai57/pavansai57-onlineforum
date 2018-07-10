import React, { Component } from 'react';


class Login extends Component{

    constructor(props)
    {
      super(props);
  
    }
  
    componentDidMount()
    {
      fetch("/api/v1/login",{
      method:'post',
      body:JSON.stringify({
        username:this.props.username,
        password:this.props.password
      })
      .then((response)=> {return response.json();})
      .then((myjson) => { this.props.login(myjson.token); })
      })
    }
  
  }

export default Login;