import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import moment from 'moment'




class DisplayPosts extends Component {

    constructor(props){
        super(props);
    }
  
  render() {
    return (
        
      <div className="container">
          {
            this.props.post!=undefined?
            <div>
            <div style={{border:"1px solid"}}>
              <div className="container">
              <table> 
                <tr>
                  <td style={{width:"15%" , align:"right"}}>
                  {this.props.post.votes}
                  <br/>
                  Votes
                  {
                    this.props.post.closed?<div>[CLOSED]</div>:""
                  }
                  {
                    this.props.post.accepted?<div>answered</div>:""
                  }
                  </td>
                <td class="col-md-6"><Link key={this.props.post.id} to={`/forum/posts/${this.props.post.id}`}>
                  <div id="wrap-post">{this.props.post.title}</div>
                </Link></td>
                </tr>
                </table>
                <div id="author" style={{float:'right', display:'block'}}>
                <p>{moment(this.props.post.created).format("MMM Do YY")+"| "} Post By: <Link to={`/forum/users/${this.props.post.userdetail.id}`}>{this.props.post.userdetail.username}</Link></p>
                </div>
                <br/>
              </div>
            </div>
            <hr/>
            </div>
            :<p>not found</p>
          }
      </div>
    );
  }
}

export default DisplayPosts;