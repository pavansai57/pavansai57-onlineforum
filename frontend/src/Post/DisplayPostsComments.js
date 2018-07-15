import React, { Component } from 'react';
import {Link} from "react-router-dom";
// import CreateComment from './CreateComment'
import CreateComment2 from './CreateComment2'
import DisplayComment from './DisplayComment'
import PostVotes from './PostVotes'
import cookie from 'react-cookies';
import EditPost from './EditPost';
import moment from 'moment';

// import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import renderHTML from 'react-render-html'

class DisplayPostComments extends Component{

    state={
        post:null,
        comments:[],
        token:null,
        is_loggedin:false,
        edit:false,
        delete:false,
        closed:false,
        closename:"close",
        loadingpost:0,
        loadingcomments:0,
    }
    constructor(props)
    {
        super(props);
        this.handleEdit=this.handleEdit.bind(this)
        this.handleDelete1=this.handleDelete1.bind(this)
        this.handleClose=this.handleClose.bind(this)
        //console.log(JSON.stringify(this.props)+"1111111111111")
    }

    doclose()
    {
            const url=`/api/v1/forum/posts/${this.state.post.id}/close`;
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
                    //thisComp.props.history.push('/forum')
                    // thisComp.setState({
                    //     closed:true,
                    //     closename:"open",
                    // })
                    thisComp.setState({
                        closed:true,
                        closename:"open",
                    })
                    thisComp.state.closed=true;
                    thisComp.state.closename="open";
                    thisComp.loadcomments();
                    thisComp.loadPostComments();
                    thisComp.render();
                }).catch(function(error){
                    console.log("error",error)
                });
            }
            else
            {
                console.log("not found");
            }
    }

    doopen()
    {
        const url=`/api/v1/forum/posts/${this.state.post.id}/open`;
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
                //thisComp.props.history.push('/forum')
                // thisComp.setState({
                //     closed:false,
                //     closename:"close"
                // })
                thisComp.setState({
                    closed:false,
                    closename:"close"
                })
                thisComp.state.closed=false;
                thisComp.closename="close";
                thisComp.loadcomments();
                thisComp.loadPostComments();
                thisComp.render();
            }).catch(function(error){
                console.log("error",error)
            });
        }
        else
        {
            console.log("not found");
        }
    }

    handleClose(event)
    {
        event.preventDefault()
        if(this.state.closed==false)
        {
            this.doclose();
        }
        else
        {
            this.doopen();
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
        //console.log(this.state.edit)
        //console.log(this.state)
    }

    handleDelete1(event)
    {
        //console.log("Asd");
        event.preventDefault();
        this.setState({
            delete:true,
        })
        let c= window.confirm("are you sure?");
        if(c==true)
        {
            const url=`/api/v1/forum/posts/${this.state.post.id}`;
            let csrftoken=cookie.load('csrftoken');
            //console.log(csrftoken);
            let token=localStorage.getItem('usertoken');
            //console.log(token);
            let lookupOptions={
                method:"Delete",
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
                    //console.log(responseData+"  Asd")
                    thisComp.props.history.push('/forum')
                }).catch(function(error){
                    console.log("error",error)
                });
            }
            else{
                console.log("not found");
            }
        }
        else{
                //console.log("Asdddddddddddddddd")
        }
    }

    loadPostComments()
    {
        //console.log(this);
        const url=`/api/v1/forum/posts/${this.props.match.params.id}`;

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
            //console.log(responseData);
            //console.log(responseData.comments)
            //console.log(thisComp.state.token)
            //console.log(thisComp.props.token)
            thisComp.setState({
                //comments:responseData.comments,
                post: responseData,
            })
            if( thisComp.state.post.closed==true)
            {   

                thisComp.setState({
                    closed:true,
                    closename:"open"
                })
            }
            else
            {
                thisComp.setState({
                    closed:false,
                    closename:"close"
                })
            }

           //console.log(JSON.stringify(thisComp.state.post))
        }).catch(function(error){
            console.log("error",error)
            //console.log(thisComp.props.history)
            //thisComp.props.history.goBack()
        });
    }

    loadcomments()
    {
        //console.log(this);
        const url=`/api/v1/forum/posts/${this.props.match.params.id}/comments`;

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
            //console.log(responseData);
            //console.log(responseData.comments)
            //console.log(thisComp.state.token)
            //console.log(thisComp.props.token)
            thisComp.setState({
                comments:responseData,
                loadingcomments:1,
            })
            if( thisComp.state.post.closed==true)
            {   

                thisComp.setState({
                    closed:true,
                    closename:"open"
                })
            }
            else{
                thisComp.setState({
                    closed:false,
                    closename:"close"
                })
            }

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
        this.loadPostComments();
        this.loadcomments();
    }

    render(){
        let owner=null
        owner=this.state.post?this.state.post.owner:null
        if (owner!=null)
        {
            //console.log(owner)
        }
        return(
            this.state.post?
        <div class="container" >
            <h3>{this.state.post.title}</h3> 
            <div className="container table-responsive" style={{border:"1px solid"}}>
            <table>
                <tr >
                <td  ><PostVotes votes={this.state.post.votes} owner={this.state.post.owner} voted={this.state.post.voted} postid={this.state.post.id} /></td>
                <td ><div class="ql-snow ql-disabled"><div id="wrap-post" class="ql-editor">{renderHTML(this.state.post.body)}</div></div>
                <div>
                {/* <ReactQuill modules={{}} readOnly={true}  id="title" name="text2" class="form-control" value={this.state.post.body}/> */}
                </div></td>
                </tr>
            </table>
            </div>
            <div id="author" style={{float:'right'}}>
                <p>{moment(this.state.post.created).format("MMM Do YY")+" | "} Post By: <Link to={`/forum/users/${this.state.post.userdetail.id}`}>{this.state.post.userdetail.username}</Link></p>
            </div>
            <div id="author" style={{float:'left'}}>
            {
                
                this.state.post.owner?
                <div className="dropdown">
                    <button type="button" class="btn btn-link dropdown-toggle" data-toggle="dropdown" >
                        options
                    </button>
                    <div className="dropdown-menu">
                        <button name="edit" value="edit" className="dropdown-item"  onClick={this.handleEdit}>Edit</button>
                        <button name="del" value="del" className="dropdown-item" onClick={this.handleDelete1}>Delete</button>
                        {   
                            (this.state.post.owner==2 || this.state.post.owner==3)?
                            <button name="close" value="clo" className="dropdown-item" onClick={this.handleClose}>{this.state.closename}</button>
                            
                            :""
                        }
                    </div>
                </div>
                :""
            }
            </div>
            <div className="container">
            {
                this.state.edit?
                <div>
                    <br/>
                <EditPost post={this.state.post} parentstate={this}/>
                </div>
                :""
            }
            </div>
            <br/>
            <hr/>
            
            <div>
            <label for="comments">Comments {this.state.post.closed?"[CLOSED]":""}</label>
            <div id="comments" class="container">
                {
            this.state.comments.length>0?this.state.comments.map((comment,index)=>{
                    return(<DisplayComment comment={comment} key={index} postowner={this.state.post.owner} loadcomments={this.loadcomments} parentstate={this}/>) }):this.state.loadingcomments==0?<p>Loading..</p>:<p>No comments</p>   
                } 
            </div>
            </div>
            {
                this.state.closed==false&& this.state.is_loggedin?
                <CreateComment2 parameters={this.props}/>
                :""
            }
        </div>:<p>Loading...</p>);
    }
}

export default DisplayPostComments;