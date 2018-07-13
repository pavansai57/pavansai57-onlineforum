import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

class ShowUsers extends Component{

    state={
        users:null,
        loadingusers:0,
    }

    constructor(props)
    {
        super(props);
    }

    loadUsers()
    {
        const url=`/api/v1/forum/users`;
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
                users:responseData,
                loadingusers:1,
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
        this.loadUsers();
    }

    render()
    {
        return(
            this.state.users?
            <div>
                <table className="table">
                <tbody>
                    <tr>
                        <th>
                            Username
                        </th>
                        <th>
                            PostKarma
                        </th>
                        <th>
                            CommentKarma
                        </th>
                    </tr>
                    {
                        this.state.users.map((user,index)=>
                        {
                            return(<tr key={index}><td><Link to={"/forum/users/"+user.id}>{user.username}</Link></td>{user.profile?<td>{user.profile.postkarma}</td>:""}{user.profile?<td>{user.profile.commentkarma}</td>:""}</tr>); 
                        })
                    }
                    </tbody>
                </table>
            </div>
            :this.state.loadingusers==0?<div>Loading...</div>:<div>No Users</div>
        )
    }
}

export default ShowUsers;