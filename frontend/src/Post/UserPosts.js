import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';
import DisplayPosts from './DisplayPost'

class UserPosts extends Component{


    state={
        posts:[],
        next_page_number:null,
        previous_page_number:null,
        has_next:null,
        has_previous:null,
        loadingposts:0,
    }
    constructor(props){
        super(props);
    }

    loadPosts()
    {
        //console.log(this.props)
        const url=`/api/v1/forum/users/${this.props.match.params.id}/posts`+this.props.location.search;
        //console.log(url+"3333333333333333")
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
                posts: responseData.results,
                next_page_number:responseData.next_page_number,
                previous_page_number:responseData.previous_page_number,
                has_next:responseData.has_next,
                has_previous:responseData.has_previous,
                loadingposts:1,
            })

        }).catch(function(error){
            console.log("error",error)
        });
    }

    createPost()
    {
        const url='/api/v1/forum';
        let csrftoken=cookie.load('csrftoken');
        //console.log(csrftoken);
        let data={
            "title": "createposts",
            "body": "hi hello createposts",
        }
        let lookupOptions={
            method:"Post",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify(data),
            credentials:'include'
        }

        if(csrftoken!=undefined)
        {

            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                //console.log(responseData)
            }).catch(function(error){
                console.log("error",error)
            });
        }
    }


    componentDidMount(){
        this.setState({
            posts:[]
        });
        this.loadPosts();
    }

    render()
    {
        //console.log(this)
        //console.log(this.props.location.pathname)
        return(
            <div>
                {
                    this.state.posts.length>0?
                    <React.Fragment>
                    <div style={{textAlign:"right"}}>
                    {
                        this.state.has_previous?
                        <a href={this.props.location.pathname+"?page="+this.state.previous_page_number}>{"<<"}Previous</a>
                        :""
                    } 
                    &ensp;&ensp;
                    {   
                        this.state.has_next?
                        <a href={this.props.location.pathname+"?page="+this.state.next_page_number}>Next{">>"}</a>
                        :""
                    }
                    </div>
                    </React.Fragment>
                    :""
                }
                {
                    this.state.posts.length>0 ? this.state.posts.map((post,index)=>{
                    return(<DisplayPosts post={post} key={index}/>) }) :this.state.loadingposts==0?<p>Loading...</p>:<p> no posts </p>
                }
            </div>
        );
    }
}

export default UserPosts; 