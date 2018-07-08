import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies'

class Signup extends Component{

    
    constructor(props)
    {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleInputChangeProfile=this.handleInputChangeProfile.bind(this)
    }

    createUser(data)
    {
        const url='/api/v1/signup';
        let csrftoken=cookie.load('csrftoken');
        console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        console.log(token);
        console.log(data)
        let lookupOptions={
            method:"Post",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify(data),
            credentials:'include'
        }
            let thisComp=this
            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                console.log(JSON.stringify(responseData)+"  Asd")
                if(responseData.email)
                {
                    alert("enter valid email")
                }
                else if(responseData.username)
                {
                    alert("enter valid username")
                }
                else if(responseData.password)
                {
                    alert("enter valid password")
                }
                else{
                    thisComp.props.history.push('/forum')
                }
            }).catch(function(error){
                console.log("error",error)
                alert(error)
            });
    }

    handleSubmit(event)
    {
        event.preventDefault();
        //console.log(this.state);
        console.log(this.props)
        this.createUser(this.state);
    }

    handleInputChange(event)
    {
        event.preventDefault();
        console.log(event.target.name,event.target.value);
        this.setState({
            [event.target.name]:event.target.value,
        })

    }

    handleInputChangeProfile(event)
    {
        event.preventDefault();
        console.log(event.target.name,event.target.value);
        this.setState({
            profile:{[event.target.name]:event.target.value}
        })

    }


    componentDidMount()
    {

    }

    componentWillMount()
    {

    }

    render()
    {
        return(
            <div className="container">
            <form className="form-control" onSubmit={this.handleSubmit}>
            <div className="form-group"> 
            <label for="username">Username</label>
            <input type="text" id="username" class="form-control" name="username" placeholder="Username" onChange={this.handleInputChange} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" name="password" placeholder="password" onChange={this.handleInputChange} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="first_name">First Name</label>
            <input type="text" id="first_name" class="form-control" name="first_name" placeholder="firstname" onChange={this.handleInputChange} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="last_name">Last Name</label>
            <input type="text" id="last_name" class="form-control" name="last_name" placeholder="lastname" onChange={this.handleInputChange} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="email">Email</label>
            <input type="text" id="email" class="form-control" name="email" placeholder="email" onChange={this.handleInputChange} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="bio">Bio</label>
            <textarea type="text" id="bio" class="form-control" name="bio" placeholder="bio" onChange={this.handleInputChangeProfile} required="required"/>
            </div>
            <div className="form-group"> 
            <input type="submit" class="btn btn-primary" value="submit"/>
            </div>
            </form>
            </div>
        );
    }
}

export default Signup;