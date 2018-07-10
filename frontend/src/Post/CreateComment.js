import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';







class CreateComment extends Component{


    state={
        text:null,
    }

    constructor(props)
    {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
    }

    createComment(data)
    {
        //console.log(this.props);
        const url=`/api/v1/forum/posts/${this.props.match.params.id}/comments`
        let csrftoken=cookie.load('csrftoken');
        //console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        //console.log(token);
        let lookupOptions={
            method:"Post",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
                'Authorization':'Bearer ' + token,
            },
            body:JSON.stringify(data),
            credentials:'include'
        }

        let thisComp=this
        if(csrftoken!=undefined)
        {
            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                //console.log(responseData+"  Asd")
                //thisComp.props.history.push(`/forum/posts/${thisComp.props.match.params.id}/`)
                window.location.reload()
            }).catch(function(error){
                console.log("error",error)
            });
        }
        else{
            console.log("not found");
        }
    }




    handleSubmit(event)
    {
        event.preventDefault();
        //console.log(this.state);
        this.createComment(this.state);
    }

    handleInputChange(event)
    {
        event.preventDefault();
        //console.log(event.target.name,event.target.value);
        this.setState({
            [event.target.name]:event.target.value,
        })

    }

    render()
    {
        return(
            
        <div class="container">
   
        <br/>
            <form onSubmit={this.handleSubmit}>
                <div class="form-group">
                    <label for="title" >Your Comment</label>
                    <textarea type="text" id="title" name="text" class="form-control" placeholder="Comment" onChange={this.handleInputChange}/>
                </div>
                <button class="btn btn-primary" >Save</button>
            </form>
        </div>)
    }
}

export default CreateComment; 