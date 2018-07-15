import React, { Component } from 'react';
import { Link } from "react-router-dom";

class ShowUser extends Component{
    state={
        user:null,
        token:null,
        loadinguser:0,
    }
    constructor(props)
    {
        super(props);
    }

    loadUserData(){
        const url=`/api/v1/forum/users/${this.props.match.params.id}`;
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
            thisComp.setState({
                user:responseData,
                loadinguser:1,
            })
        }).catch(function(error){
            console.log("error",error)
        });
    }

    componentWillMount()
    {
        this.loadUserData();
    }

    render()
    {
        return(
            this.state.user?
            <div>
                <h1>{this.state.user.username}</h1>
                <Link to={"/forum/users/"+this.state.user.id+"/posts"}>Posts</Link>&ensp;
                <Link to={"/forum/users/"+this.state.user.id+"/comments"}>Comments</Link>
                <table className="table">
                <tbody>
                <tr><td>First Name</td><td>{this.state.user.first_name}</td></tr>
                <tr><td>Last Name</td><td>{this.state.user.last_name}</td></tr>
                <tr><td>Email</td><td>{this.state.user.email}</td></tr>
                <tr><td>Post Karma</td><td>{this.state.user.profile.postkarma}</td></tr>
                <tr><td>Comment Karma</td><td>{this.state.user.profile.commentkarma}</td></tr>
                <tr><td>Bio</td><td>{this.state.user.profile.bio}</td></tr>
                </tbody>
                </table>
            </div>:this.state.loadinguser==0?<p>Loading...</p>:<p>Cannot load</p>

        );
    }
}

export default ShowUser; 