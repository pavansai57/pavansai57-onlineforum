import React, { Component } from 'react';

class InputEx extends Component{

    state={name:' ', pass:' '};
    
    constructor(props)
    {
      super(props);
      this.handleInputChange=this.handleInputChange.bind(this)
    }

    handleInputChange(event)
    {
        event.preventDefault();
        console.log(event.target.name,event.target.value);
        this.setState({
            [event.target.name]:event.target.value,
        })

    }
    
    saveName =(event) => {
      const { target: {value}} =event;
      this.setState({
        name:value	
        });
      }
      
      savePass =(event) => {
        const {target: {value}} = event;
        this.setState({
          pass:value
          });
        }
      
      submit = (e) => {
        const {name,pass} = this.state;
        console.log(name);
        console.log(pass);
        console.log(JSON.stringify({
          username: `${name}`,
          password: `${pass}`,
        }))
        fetch('/api/v1/login',{ method: 'post', headers:{ "Content-type": "application/json; charset=UTF-8"},
        body:JSON.stringify({
          username: `${name}`,
          password: `${pass}`,
        })
        }).then(res =>{ console.log(res); return res.json();}).then((myjson) => {
          console.log(myjson);
          if(myjson.token)
           {
              this.props.login(myjson.token,myjson.user.username,myjson.user.groups,myjson.user.id);
              this.props.history.push("/forum")
              //console.log(this)
           }
          else{
            alert("wrong user anme or password")
          }
        })
        .catch(function(error){
          console.log("error",error)
          alert("wrong user name or password")
      });
      }
    
    
      render() {
        return (
                  // <div class="container"><div id="login" className="form-group"><p>Login</p> <input className="form-control" onChange={this.saveName} name="name"/>
                  // <br/>
                  // <input type="password" className="form-control" onChange={this.savePass} name="pass"/>
                  // <br/>
                  // <button className="btn btn-primary" onClick={this.submit} >Submit</button>
                  // </div>
                  // </div>
                  <div className="container">
                  <form className="form-control" >
                  <div className="form-group"> 
                  <label for="username">Username</label>
                  <input type="text" id="username" class="form-control" name="name" placeholder="Username" onChange={this.handleInputChange} required="required"/>
                  </div>
                  <div className="form-group"> 
                  <label for="password">Password</label>
                  <input type="password" id="password" class="form-control" name="pass" placeholder="password" onChange={this.handleInputChange} required="required"/>
                  </div>
                  <div className="form-group"> 
                  <input type="button" class="btn btn-primary" value="submit" onClick={this.submit}/>
                  </div>
                  </form>
                  </div>
              )
            }
    }

export default InputEx;