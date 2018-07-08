import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';

class EditProfile extends Component{

    state={
        user:null,
        profile:null,
    }

    constructor(props)
    {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleInputChangeProfile=this.handleInputChangeProfile.bind(this)
    }

    loadUser()
    {
        const url=`/api/v1/forum/users/${this.props.userid}`;
        let lookupOptions={
            method:"GET",
            headers:{
                'Content-Type':'application/json'
            }
        }
        let thisComp=this
        fetch(url,lookupOptions)
        .then(function(response){
            return response.json();
        }).then(function(responseData){
            console.log(responseData);
            if(responseData=="no such user")
            {
                thisComp.props.history.push("/forum/login")
            }
            thisComp.setState({
                user:responseData,
                first_name:responseData.first_name,
                last_name:responseData.last_name,
                email:responseData.email,
                profile:responseData.profile,
            })
            console.log(thisComp.state)
        }).catch(function(error){
            console.log("error",error)
        });

    }

    createUser(data)
    {
        
        const url=`/api/v1/forum/users/${this.props.userid}`;
        let csrftoken=cookie.load('csrftoken');
        console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        console.log(token);
        console.log(data)
        let lookupOptions={
            method:"PUT",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
                'Authorization':'Bearer ' + token,
            },
            // body:JSON.stringify(data),
            body:JSON.stringify({
                first_name:data.first_name,
                last_name:data.last_name,
                email:data.email,
                profile:{bio:data.profile.bio},
            }),
            credentials:'include'
        }
            let thisComp=this
            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                console.log(responseData+"  Asd")
                thisComp.props.history.push('/forum/myprofile')
            }).catch(function(error){
                console.log("error",error)
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
        this.loadUser();
    }

    componentWillMount()
    {
    }

    render()
    {
        return(
            this.state.user?
            <div className="container">
            <form className="form-control" onSubmit={this.handleSubmit}>
            <div className="form-group"> 
            <label for="first_name">First Name</label>
            <input type="text" id="first_name" class="form-control" name="first_name" placeholder="firstname" onChange={this.handleInputChange} value={this.state.first_name} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="last_name">Last Name</label>
            <input type="text" id="last_name" class="form-control" name="last_name" placeholder="lastname" onChange={this.handleInputChange} value={this.state.last_name} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="email">Email</label>
            <input type="text" id="email" class="form-control" name="email" placeholder="email" onChange={this.handleInputChange} value={this.state.email} required="required"/>
            </div>
            <div className="form-group"> 
            <label for="bio">Bio</label>
            <textarea type="text" id="bio" class="form-control" name="bio" placeholder="bio" onChange={this.handleInputChangeProfile} value={this.state.profile.bio} required="required"/>
            </div>
            <div className="form-group"> 
            <input type="submit" class="btn btn-primary" value="submit"/>
            </div>
            </form>
            </div>
            :""
        );
    }
}

export default EditProfile; 