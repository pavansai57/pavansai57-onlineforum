import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import CommentVotes from './CommentVotes'
import EditComment from './EditComment'
import cookie from 'react-cookies';
import moment from 'moment';

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import renderHTML from 'react-render-html'

class DisplayComment extends Component{
    
    state={
        edit:false,
        accepted:false,
        buttonaccept:"Accept",
    }

    constructor(props)
    {
        super(props);
        this.handleEdit=this.handleEdit.bind(this)
        this.handleDelete1=this.handleDelete1.bind(this)
        this.handleAccept=this.handleAccept.bind(this)
        if(this.props.comment.accepted==true)
        {
            this.state.accepted=true;
            this.state.buttonaccept="Unaccept"
        }
        else{
            this.state.accepted=false;
            this.state.buttonaccept="Accept"
        }
        
    }

    doaccept()
    {
        let thisparent=this.props.parentstate
        const url=`/api/v1/forum/posts/${this.props.comment.post}/comments/${this.props.comment.id}/accept`;
        let csrftoken=cookie.load('csrftoken');
        console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        console.log(token);
        let lookupOptions={
            method:"Post",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
                'Authorization':'Bearer ' + token,
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
                window.location.reload()
                // thisparent.loadcomments();
                // thisComp.setState({
                //     accepted:true,
                //     buttonaccept:"Unaccept"
                // })
                // thisparent.render();
                // thisComp.render();
            }).catch(function(error){
                console.log("error",error)
            });
        }
        else{
            console.log("not found");
        }
    }

    dounaccept()
    {
        let thisparent=this.props.parentstate
        const url=`/api/v1/forum/posts/${this.props.comment.post}/comments/${this.props.comment.id}/unaccept`;
        let csrftoken=cookie.load('csrftoken');
        console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        console.log(token);
        let lookupOptions={
            method:"Post",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
                'Authorization':'Bearer ' + token,
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
                // thisparent.loadcomments();
                // thisComp.setState({
                //     accepted:false,
                //     buttonaccept:"Accept"
                // })
                window.location.reload()
                // thisparent.render();
                // thisComp.render();
            }).catch(function(error){
                console.log("error",error)
            });
        }
        else{
            console.log("not found");
        }
    }

    handleAccept(event)
    {
        if(this.state.accepted==false)
        {
            this.doaccept();
            this.state.accepted=true;  
        }
        else
        {
            this.dounaccept();
            this.state.accepted=false;
        }
    }

    handleEdit(event)
    {
        event.preventDefault();
        if(this.state.edit==false)
        {
            this.setState({
                edit:true
            })
        }
        else
        {
            this.setState({
                edit:false
            })
        }
        console.log(this.state.edit)
        console.log(this.state)
    }


    handleDelete1(event)
    {
        console.log("Asd");
        event.preventDefault();
        this.setState({
            delete:true,
        })
        let c= window.confirm("are you sure?");
        if(c==true)
        {
            let thisparent=this.props.parentstate
            const url=`/api/v1/forum/posts/${this.props.comment.post}/comments/${this.props.comment.id}`;
            let csrftoken=cookie.load('csrftoken');
            console.log(csrftoken);
            let token=localStorage.getItem('usertoken');
            console.log(token);
            let lookupOptions={
                method:"Delete",
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRFToken':csrftoken,
                    'Authorization':'Bearer ' + token,
                },
                credentials:'include'
            }
            let thisComp=this
            if(csrftoken!=undefined)
            {
                fetch(url,lookupOptions)
                .then(function(response){
                    return response.json()
                }).then(function(responseData){
                    console.log(responseData+"  Asd")
                    //window.location.reload()
                    thisparent.loadcomments();
                }).catch(function(error){
                    console.log("error",error)
                });
            }
            else{
                console.log("not found");
            }
        }
        else{
                console.log("Asdddddddddddddddd")
        }
    }






    componentDidMount(){
        console.log(this.props);
    }
    
render(){
    return(
        this.props.comment?
        <div>
        <div className="container" style={{border:"1px solid"}}>
            <table cellspacing="2px">
                <tr>
                    <td><span><CommentVotes postid={this.props.comment.post} commentid={this.props.comment.id} owner={this.props.comment.owner} votes={this.props.comment.votes} voted={this.props.comment.voted} accepted={this.props.comment.accepted}/></span></td>
                    <td className="container"><div >{renderHTML(this.props.comment.text)}</div></td>
                </tr>
            </table>
            {/* <span style={{float:'right'}}>by: <Link to={`/forum/users/${this.props.comment.userdetail.id}`} >{this.props.comment.userdetail.username}</Link></span> */}
            
        </div>
        
        <div id="author" style={{float:'left'}}>
            <span style={{float:'left'}}>
            {
                        (this.props.postowner===1 || this.props.postowner===3)?
                        <button className="btn btn-link" name="accept" value="accept" onClick={this.handleAccept}>{this.state.buttonaccept}</button>
                        :""
            }
            </span>
            {
                <span>
                <Link className="btn btn-link" to={'/forum/posts/'+ this.props.comment.post}>Post Link</Link>
                </span>
            }
            {
                
                this.props.comment.owner?
                <span className="dropdown">
                    <button type="button" class="btn btn-link dropdown-toggle" data-toggle="dropdown" >
                        options
                    </button>
                    {/* {
                        (this.props.postowner===1 || this.props.postowner===3)?
                        <button className="btn btn-link" name="accept" value="accept" onClick={this.handleAccept}>{this.state.buttonaccept}</button>
                        :""
                    } */}
                    <div className="dropdown-menu">
                        <button name="edit" value="edit" className="dropdown-item"  onClick={this.handleEdit}>Edit</button>
                        <button name="del" value="del" className="dropdown-item" onClick={this.handleDelete1}>Delete</button>
                    </div>
                </span>
                :""
            }
        </div>
        <span style={{padding:"200px"}} style={{float:'right'}}> by: <Link to={`/forum/users/${this.props.comment.userdetail.id}`} >{this.props.comment.userdetail.username}</Link></span>
        <span style={{float:'right'}}>{moment(this.props.comment.created).format("MMM Do YY")+"| "} </span>
            <div className="container">
            {
                this.state.edit?
                <div>
                    <br/>
                <EditComment comment={this.props.comment} parentstate={this.props.parentstate}/>
                </div>
                :""
            }
            </div>
        <br/>
        <hr/></div>:""
    );
}
    
}

export default DisplayComment; 