import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';

class PostVotes extends Component{

    state={
        up:0,
        down:0,
        colorup:"black",
        colordown:"black",
        votes:null,
    }

    constructor(props)
    {
        super(props);
        this.changeVoteUp=this.changeVoteUp.bind(this);
        this.changeVoteDown=this.changeVoteDown.bind(this);
        //console.log(this.props.voted+"qwerryy");
        this.state.votes=this.props.votes;

        if(this.props.voted==1)
        {
            this.state.colorup="orange"
            this.state.up=1
        }
        else if(this.props.voted==-1)
        {
            this.state.colordown="orange"
            this.state.down=1
            
        }
        else{
            this.state.colorup="black"
            this.state.colordown="black"
            this.state.up=0
            this.state.down=0
        }
        //this.handleSubmit=this.handleSubmit.bind(this)
        //this.handleInputChange=this.handleInputChange.bind(this)
    }

    dovote(vote)
    {

        const url=`/api/v1/forum/posts/${this.props.postid}/vote?${vote}`
        console.log(this.props.postid)
        console.log(url)
        let csrftoken=cookie.load('csrftoken');
        console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        console.log(token);

        let lookupOptions={
            method:"Get",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
                'Authorization':'Bearer ' + token,
            },
            credentials:'include'
        }

        let thisComp=this
        console.log(url)
        if(csrftoken!=undefined && token!=undefined && token!=null)
        {
            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                console.log(responseData+"  Asd")
                //thisComp.props.history.push(`/forum/posts/${thisComp.props.match.params.id}/`)
            }).catch(function(error){
                console.log("error",error)
            });
        }
        else{
            console.log("csrf not found or user not logged in");
        }
    }

    changeVoteUp(event)
    {
        event.preventDefault();
        
        //console.log(event);
        //console.log(event.target.classList)
        //console.log(this.props.voted+"qwerryy");
        if(this.state.colorup=="black")
        {   
            if(this.state.colordown=="orange")
            {
                this.state.votes=this.state.votes+2;
            }
            else{
                this.state.votes=this.state.votes+1;
            }

            this.setState({
                colorup:"orange",
                colordown:"black"
            })

            this.dovote("upvote")
        }
        else
        {
            this.state.votes=this.state.votes-1;
            this.setState({
                colorup:"black",
            })
            this.dovote("unvote")
        }
    }

    changeVoteDown(event)
    {
        event.preventDefault();
        
        console.log(event);
        console.log(event.target.classList)
        if(this.state.colordown=="black")
        {
            if(this.state.colorup=="orange")
            {
                this.state.votes=this.state.votes-2;
            }
            else{
                this.state.votes=this.state.votes-1;
            }
            
            this.setState({
                colordown:"orange",
                colorup:"black"
            })
            this.dovote("downvote")
        }
        else
        {
            this.state.votes=this.state.votes+1;
            this.setState({
                colordown:"black"
            })
            this.dovote("unvote")
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
        <div className="container" style={{position:'relative'}} >
            <i class="fa fa-arrow-up" id="arrowup" onClick={this.changeVoteUp} style={{color:this.state.colorup}}></i>
            <div ><span id="postvote" style={{textAlign:'center',position:'absolute'}}>{this.state.votes}</span><br/></div>
            <i class="fa fa-arrow-down" id="arrowdown" onClick={this.changeVoteDown} style={{color:this.state.colordown}}></i>
        </div>);
    }
}

export default PostVotes;