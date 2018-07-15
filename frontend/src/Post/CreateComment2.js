import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';



import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// import renderHTML from 'react-render-html'



class CreateComment2 extends Component{


    state={
        text:null,
    }

    constructor(props)
    {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleInputChange2=this.handleInputChange2.bind(this)
    }

    createComment(data)
    {
        //console.log(this.props);
        const url=`/api/v1/forum/posts/${this.props.parameters.match.params.id}/comments`
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

    handleInputChange2(event)
    {
        //event.preventDefault();
        //console.log(event);
        this.setState({
            text:event
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
                    {/* <textarea type="text" id="title" name="text" class="form-control" placeholder="Comment" onChange={this.handleInputChange}/> */}
                    <ReactQuill modules={CreateComment2.modules} formats={CreateComment2.formats}  id="title" name="text2" class="form-control" placeholder="Comment" onChange={this.handleInputChange2}/>
                </div>
                <button class="btn btn-primary" >Save</button>
            </form>
        </div>)
    }
}

CreateComment2.modules = {
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
  
  CreateComment2.formats = [
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

export default CreateComment2; 