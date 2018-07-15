import React, { Component } from 'react';
import {  Link } from "react-router-dom";
// import cookie from 'react-cookies';


class Myprofile extends Component{

    state={
        is_loggedin:null,
        user:null,
        token:null,
        username:null,
        mod:null,
        userid:0,
    }

    constructor(props)
    {
        super(props);
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
            //console.log(responseData);
             if(responseData=="no such user")
             {
                 thisComp.props.history.push('/forum/login')
             }
            thisComp.setState({
                user:responseData,
            })
        }).catch(function(error){
            console.log("error",error)
        });

    }

    componentDidMount()
    {

    }

    componentWillMount()
    {
        let token1=localStorage.getItem('usertoken');
        let user=localStorage.getItem('username')
        let mod=localStorage.getItem('mod')
        let userid=localStorage.getItem('userid')
        //console.log(token1);
        if(token1!= null && token1!= undefined)
        {
            this.setState({ is_loggedin:true, token:token1, username:user,mod:mod,userid:userid });
        }
        this.loadUser();
    }


    render()
    {
        return(
            this.state.user && (this.state.token!=null || this.state.token!=undefined)?
            <div>
                <h1 style={{display:"inline-block"}}>{this.state.user.username}</h1> &ensp;
                <Link to="/forum/myprofile/edit">Edit</Link>
                <div>
                <Link to={"/forum/users/"+this.state.user.id+"/posts"}>Posts</Link>&ensp;
                <Link to={"/forum/users/"+this.state.user.id+"/comments"}>Comments</Link>
                </div>
                <table class="table">
                <tr><td>First Name</td><td>{this.state.user.first_name}</td></tr>
                <tr><td>Last Name</td><td>{this.state.user.last_name}</td></tr>
                <tr><td>Email</td><td>{this.state.user.email}</td></tr>
                <tr><td>Post Karma</td><td>{this.state.user.profile.postkarma}</td></tr>
                <tr><td>Comment Karma</td><td>{this.state.user.profile.commentkarma}</td></tr>
                <tr><td>Bio</td><td>{this.state.user.profile.bio}</td></tr>
                </table>
            </div>:""
        )
    }
}

export default Myprofile;