import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Posts from './Post/Posts'
import Login from './Auth/Login'
import InputEx from './Auth/InputLogin'
import DisplayPostComments from './Post/DisplayPostsComments'
import ShowUser from './Post/User'
import CreatePost from './Post/CreatePost'
import SignUp from './Auth/Signup'
import CreateComment from './Post/CreateComment'
import SearchBar from './Post/SearchBar'
import MyProfile from './Post/MyProfile'
import EditProfile from './Post/EditProfile'
import UserPosts from './Post/UserPosts'
import UserComments from './Post/UserComments'
import ShowUsers from './Post/ShowUsers'

import { withRouter } from 'react-router';
import { addQuery, removeQuery } from './Post/test';



class App extends Component {

  
  state={
    login_url:"/api/v1/login",
      is_loggedin: false,
      token: null,
      username:null,
      mod:false,
      userid:0,
  }

  constructor(props){
    super(props);
  }


/*
 addQuery = (query) => {
  const location = Object.assign({}, this.props.location);
  Object.assign(location.query, query);
  this.props.history.push('/forum')
};

 removeQuery = (queryNames) => {
  const location = Object.assign({}, this.props.location);
  queryNames.forEach(q => delete location.query[q]);
  this.props.history.push('/forum')
};
*/









  login = (token1,user,groups,userid) => {
    this.state.is_loggedin=true;
    this.setState({ token:token1,username:user,userid:userid });
    if(1== groups[0])
    {
        //console.log("5555555555555555555555")
        this.setState({
          mod:true,
        }) 
    }
    localStorage.setItem('usertoken', token1)
    localStorage.setItem('username',user)
    localStorage.setItem('mod',true)
    localStorage.setItem('userid',userid)
    //console.log(token1);
    //console.log(this.state.is_loggedin);
    //window.location.reload()
  }

  logout=()=>{
    localStorage.removeItem("usertoken");
    localStorage.removeItem('username');
    localStorage.removeItem('mod');
    localStorage.removeItem('userid');
    this.state.is_loggedin=false;
    this.state.token=null;
    this.setState({ is_loggedin:false, token:null,username:null,mod:false,userid:0 });
    window.location.reload()
  }

  componentWillMount(){
    let token1=localStorage.getItem('usertoken');
    let user=localStorage.getItem('username')
    let mod=localStorage.getItem('mod')
    let userid=localStorage.getItem('userid')
    //console.log(token1);
    if(token1!= null && token1!= undefined)
    {
      this.setState({ is_loggedin:true, token:token1, username:user,mod:mod,userid:userid });
    }
    //console.log(this)
  }


  render() {
    let thiscomp=this
    //console.log(this)
    return (
      <Router>
        <React.Fragment>
    {/* <nav class="navbar navbar-expand-lg bg-dark">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNavDropdown" class="navbar-collapse collapse">
            <ul class="navbar-nav mr-auto">
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Dropdown
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ url('/login') }}">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ url('/register') }}">Register</a>
                </li>
            </ul>
        </div>
    </nav>
</div> */}
         <div  class="container">
        <nav class="navbar navbar-expand-lg bg-dark">
          <div class="container">
            <h1><a class="navbar-brand" href="/forum">Onlineforum</a></h1>
            <div class="nav navbar-nav">
            <ul class="navbar-nav mr-auto">
            <li class="nav-item"><a className="nav-link" href="/forum/users">Users</a></li>
            </ul>
            <ul class="navbar-nav">
            {
              this.state.is_loggedin?
              <React.Fragment>
              <li class="nav-item"><Link className="nav-link" to="/forum/myprofile">Myprofile</Link></li>
              <li class="nav-item"><a href="#" className="nav-link" onClick={this.logout}>Logout</a></li>
              </React.Fragment>
              :
              <React.Fragment>
              <li class="nav-item"><Link className="nav-link" to="/forum/login">Login</Link></li>
              <li class="nav-item"><Link className="nav-link" to="/forum/signup">Signup</Link></li>
              </React.Fragment>
            }
            </ul>
            </div>
          </div>
        </nav>
        <div class="container" style={{textAlign:"center"}}>
        <Route component={SearchBar}/>
        </div>
        <hr/>
        {
          this.state.is_loggedin?
          <div className="my-3">
            <Link to="/forum/createpost/" >Create Post</Link>
            </div>:""
        }
        <div>
          <Switch>
          <Route exact path="/" render={(props) => (    <Posts {...props} token={this.state.token} timestamp={new Date().toString()} />  )}/>
          <Route exact path="/forum/" render={(props) => (    <Posts {...props} token={this.state.token} timestamp={new Date().toString()} />  )}/>
          <Route exact  path="/forum/posts/:id" render={(props) => (    <div><DisplayPostComments {...props} token={this.state.token}/> {
            // this.state.is_loggedin?
            // <CreateComment {...props} token={this.state.token}/>:""
          }</div>  )}/>
          <Route exact  path="/forum/users/:id" render={(props) => (    <ShowUser {...props} token={this.state.token} />  )}/>
          <Route exact  path="/forum/signup" render={(props) => (    <SignUp {...props} token={this.state.token} />  )}/>
          <Route exact path="/forum/createpost/" render={(props) => (<CreatePost {...props} token={this.state.token} />  )}/>
          <Route exact path="/forum/login/" render={(props) => (    <InputEx {...props} token={this.state.token} login={this.login} />  )}/>
          <Route exact path="/forum/myprofile" render={(props)=>( <MyProfile {...props} token={this.state.token} userid={this.state.userid}/> )}/>
          <Route exact path="/forum/myprofile/edit" render={(props)=>( <EditProfile {...props} token={this.state.token} userid={this.state.userid}/> )}/>
          <Route exact path="/forum/users/:id/posts" render={(props)=>(<UserPosts {...props} token={this.state.token} userid={this.state.userid}/>)}/>
          <Route exact path="/forum/users/:id/comments" render={(props)=>(<UserComments {...props} token={this.state.token} userid={this.state.userid}/>)}/>
          <Route exact path="/forum/users" render={(props)=>(<ShowUsers {...props} token={this.state.token} userid={this.state.userid}/>)}/>
        </Switch>
        </div>
      </div>
      </React.Fragment>
      </Router>
    );
  }
}

 



export default App;