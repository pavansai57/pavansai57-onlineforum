import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies'


import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// import renderHTML from 'react-render-html'



class CreatePost extends Component{

    state={
        title:null,
        body:null,
    }
    constructor(props)
    {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleInputChange2=this.handleInputChange2.bind(this)
    }

    createPost(data)
    {
        const url='/api/v1/forum';
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
        let thisComp=this;
        if(csrftoken!=undefined)
        {
            fetch(url,lookupOptions)
            .then(function(response){
                return response.json()
            }).then(function(responseData){
                //console.log(responseData+"  Asd")
                thisComp.props.history.push('/forum/posts/'+responseData.post_id)
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
        this.createPost(this.state);
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
            body:event
        })

    }

    componentWillMount()
    {
    }

    componentDidMount()
    {

    }

    render()
    {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div class="form-group">
                        <label for="title" >Post Title</label>
                        <input type="text" id="title" name="title" class="form-control" placeholder="Title" onChange={this.handleInputChange}></input>
                    </div>
                    <div class="form-group">
                        <label for="body" >Body</label>
                        {/* <textarea type="text" id="body" name="body" class="form-control" placeholder="Content"  onChange={this.handleInputChange}></textarea> */}
                        <ReactQuill modules={CreatePost.modules} formats={CreatePost.formats}  id="body" name="body" class="form-control" placeholder="Body" onChange={this.handleInputChange2}/>
                    </div>
                    <button class="btn btn-primary" >Save</button>
                </form>
            </div>
        );
    }
}


CreatePost.modules = {
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
  
  CreatePost.formats = [
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

export default CreatePost;