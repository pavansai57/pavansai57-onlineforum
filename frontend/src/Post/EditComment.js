import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';

// import renderHTML from 'react-render-html'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


class EditComment extends Component{

    state={
        text:null,
    }
    
    constructor(props)
    {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleInputChange2=this.handleInputChange2.bind(this)
        this.state.text=this.props.comment.text
    }

    updateComment(data)
    {
        let thisparent=this.props.parentstate
        const url=`/api/v1/forum/posts/${this.props.comment.post}/comments/${this.props.comment.id}`;
        let csrftoken=cookie.load('csrftoken');
        //console.log(csrftoken);
        let token=localStorage.getItem('usertoken');
        //console.log(token);
        let lookupOptions={
            method:"PUT",
            headers:{
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken,
                'Authorization':'Bearer ' + token,
            },
            body:JSON.stringify(data),
            credentials:'include'
        }
        let thisComp=this;
        if(csrftoken!=undefined)
        {
            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                //console.log(responseData+"  Asd")
                thisparent.loadcomments();
                //window.location.reload()
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
        this.updateComment(this.state);
    }

    handleInputChange(event)
    {
        event.preventDefault();
        //console.log(event.target.name,event.target.value);
        this.setState({
            [event.target.name]:event.target.value,
        })

    }

    handleInputChange2(event)
    {
        //event.preventDefault();
        //console.log(event);
        this.setState({
            text:event
        })
        //this.state.text=event;

    }

    render()
    {
        // let title=null;
        // title=this.props.post.title;
        // let body=null;
        // body= this.props.post.body;
        // console.log(this.props+"Asd12124545678");
        
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div class="form-group">
                        <br/>
                        <label for="text" >Your Comment</label>
                        {/* <input type="text" id="text" name="text" class="form-control" placeholder="comment" onChange={this.handleInputChange} value={this.state.text}></input> */}
                        <ReactQuill modules={EditComment.modules} formats={EditComment.formats}  id="title" name="text" class="form-control" placeholder="Comment" onChange={this.handleInputChange2} value={this.state.text}/>
                    </div>
                    <button class="btn btn-primary" >Save Edit</button>
                </form>
            </div>
        );
    }
}




EditComment.modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block']
    ]
  };
  
  EditComment.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
  ];


export default EditComment; 