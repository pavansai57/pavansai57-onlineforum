import React, { Component } from 'react';
import cookie from 'react-cookies'
import DisplayPosts from './DisplayPost'

// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
//import queryString from 'query-string';
//import qs from 'qs'
//const queryString = require('query-string');
var queryString = require('qs');

class Posts extends Component {

    state={
        posts:[],
        next_page_number:null,
        previous_page_number:null,
        has_next:null,
        has_previous:null,
        page:null,
        loadingdone:0,
    }
    constructor(props){
        super(props);
    }

    loadPosts()
    {
        //console.log(this.props)
        const url='/api/v1/forum'+this.props.location.search;
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
                loadingdone:1,
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
                console.log(responseData)
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
        //searchstring=""
        let searchstring=""
        //console.log(this.props.location.search)
        if(this.props.location.search[0]=='?')
        {
            searchstring=this.props.location.search.slice(1,)
        }
        else{
            searchstring=this.props.location.search
        }
        let searchdatanext=queryString.parse(searchstring)
        let searchdataprevious=queryString.parse(searchstring)
        //console.log(searchdatanext.page)
        //console.log(searchdataprevious.page)
        searchdatanext.page=this.state.next_page_number
        searchdataprevious.page=this.state.previous_page_number
        let nextquerystring=queryString.stringify(searchdatanext)
        let previousquerystring=queryString.stringify(searchdataprevious)
        //nextquerystring=nextquerystring.slice(3,)
        //console.log(nextquerystring)
        //console.log(previousquerystring)
        // var str="";
        // for (var key in this.state) {
        //     if (str != "") {
        //         str += "&";
        //     }
        //     str += key + "=" + encodeURIComponent(this.state[key]);
        // }
        // console.log(str)
        return(
            <div>
                {
                    this.state.posts.length>0?
                    <React.Fragment>
                    <div style={{textAlign:"right"}}>
                    {
                        this.state.has_previous?
                        <a href={this.props.location.pathname+"?"+previousquerystring}>{"<<"}Previous</a>
                        :""
                    } 
                    &ensp;&ensp;
                    {   
                        this.state.has_next?
                        <a href={this.props.location.pathname+"?"+nextquerystring}>Next{">>"}</a>
                        :""
                    }
                    </div>
                    </React.Fragment>
                    :""
                }
                {
                    this.state.posts.length>0 ? this.state.posts.map((post,index)=>{
                    return(<DisplayPosts post={post} key={index}/>) }) :this.state.loadingdone==0?<p>Loading...</p>:<p> no posts </p>
                }
            </div>
        );
    }
}

export default Posts;