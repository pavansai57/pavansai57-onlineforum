import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

class AllUsers extends Component{

    state={
        users:null,
    }
    constructor(props)
    {
        super(props);
    }

    getAllUsers()
    {
        
        const url='/api/v1/forum/users';
        let csrftoken=cookie.load('csrftoken');
        console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        console.log(token);
        let lookupOptions={
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            credentials:'include'
        }
        let thisComp=this;
        if(csrftoken!=undefined)
        {
            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                console.log(responseData+"  Asd")
                thisComp.setState({
                    users:responseData,
                })
                //thisComp.props.history.push('/forum')
            }).catch(function(error){
                console.log("error",error)
            });
        }
        else{
            console.log("not found");
        }

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
            this.state.users?
            <table class="table">
                {
                    this.state.users.map((user,index)=>{
                    return(<tr><td></td><td></td></tr>) }) 
                } 
            </table>
            :""
        )
    }
}

export default AllUsers; 