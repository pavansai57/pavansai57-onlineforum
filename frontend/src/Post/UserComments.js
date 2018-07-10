import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import CreateComment from './CreateComment'
import CreateComment2 from './CreateComment2'
import DisplayComment from './DisplayComment'
import PostVotes from './PostVotes'
import cookie from 'react-cookies';
import EditPost from './EditPost';
import moment from 'moment';

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import renderHTML from 'react-render-html'

class UserComments extends Component{

    state={
        post:null,
        comments:null,
        token:null,
        is_loggedin:false,
        edit:false,
        delete:false,
        closed:false,
        closename:"close",
    }
    constructor(props)
    {
        super(props);
        //console.log(JSON.stringify(this.props)+"1111111111111")
    }

    

   

    

    

    loadcomments()
    {
        //console.log(this);
        const url=`/api/v1/forum/users/${this.props.match.params.id}/comments`;

        let csrftoken=cookie.load('csrftoken');
        //console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        //console.log(token);

        let lookupOptions={};
        if(token!=undefined && token!=null)
        {
            lookupOptions={
                method:"GET",
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRFToken':csrftoken,
                    'Authorization':'Bearer ' + token,
                },
            }
        }
        else{
            lookupOptions={
                method:"GET",
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRFToken':csrftoken,
                },
            }
        }

        let thisComp=this
        fetch(url,lookupOptions)
        .then(function(response){
            return response.json();
        }).then(function(responseData){
            // console.log(responseData);
            // console.log(responseData.comments)
            // console.log(thisComp.state.token)
            // console.log(thisComp.props.token)
            thisComp.setState({
                comments:responseData,
            })

           //console.log(JSON.stringify(thisComp.state.post))
        }).catch(function(error){
            console.log("error",error)
            //console.log(thisComp.props.history)
            //thisComp.props.history.goBack()
        });
    }





    componentWillMount()
    {
        let token1=localStorage.getItem('usertoken');
        //console.log(token1);
        if(token1!= null && token1!= undefined)
        {
            this.setState({ is_loggedin:true, token:token1 });
        }
    }

    componentDidMount(){
        //this.loadPostComments();
        this.loadcomments();
    }

    render(){
        //console.log(this.state.comments)
        return(
            this.state.comments?
            <div>
            <label for="comments">Comments</label>
            <div id="comments" class="container">
                {
            this.state.comments.map((comment,index)=>{
                    return(<DisplayComment comment={comment} key={index} postowner={comment.postowner} loadcomments={this.loadcomments} parentstate={this}/>) })   
                } 
            </div>
            </div>
            :<div>No Comments</div>
        );
    }
}

export default UserComments;