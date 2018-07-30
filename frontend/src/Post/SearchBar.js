import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
// import cookie from 'react-cookies';
// import {withRouter} from 'react-router'


var queryString = require('qs');







class SearchBar extends Component{

    

    state={
        name:"search",
        search:"",
        filter:"",
        sort:"",
    }

    constructor(props)
    {
        super(props);
        this.handleSearch=this.handleSearch.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleInputChange2=this.handleInputChange2.bind(this)
        this.handleInputChange3=this.handleInputChange3.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)

        this.handlelink=this.handlelink.bind(this)
        let searchstring=""
        if(this.props.location.search[0]=='?')
        {
            searchstring=this.props.location.search.slice(1,)
        }
        else{
            searchstring=this.props.location.search
        }
        //queryString.parse(this.props.location.search)
        //queryString.stringify(this.props.location.search)
        this.state=queryString.parse(searchstring)
    }

    handlelink(event)
    {
        event.preventDefault();
    }
    
    handleValueChange = (mdeState) => {
        this.setState({mdeState});
    }

    handleSubmit(event)
    {
        event.preventDefault();
        //console.log(event)
        //console.log(this.state)
        console.log(this.props.history)
        this.props.history.push(`/forum?${queryString.stringify(this.state)}`)
        // this.props.parentstate.rerender
        // this.props.parentstate.forceUpdate()
        // console.log(this.props.parentstate)
        // this.props.parentstate.setState({
        //     a:123,
        // })
        window.location.reload()
        
    }

    handleInputChange(event)
    {
        //console.log(event)
    
        //console.log(event.target.name,event.target.value);
        this.setState({
            [event.target.name]:event.target.value,
            name:event.target.value
        })
       // this.render()
        //event.target.name=this.state.filter

    }

    handleInputChange2(event)
    {
        //console.log(event)
    
        //console.log(event.target.name,event.target.value);
        this.setState({
            search:event.target.value,
        })
       // this.render()
        //event.target.name=this.state.filter

    }

    handleInputChange3(event)
    {
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    handleSearch(event)
    {
        //console.log(this.props.location);
        // fetch('/api/form-submit-url', {
        //     method: 'GET',
        //     body: data,
        // });
        //this.props.location.history.push(`/forum?${this.state.search}`)
    }

    test1(x)
    {
        //console.log(x)

    }

    componentDidMount()
    {

    }

    componentWillMount()
    {

    }

    render()
    {
        let unansweredcolor="lightgrey"
        let closedcolor="lightgrey"
        let answeredcolor="lightgrey"
        let opencolor="lightgrey"

        let searchstring=""
        if(this.props.location.search[0]=='?')
        {
            searchstring=this.props.location.search.slice(1,)
        }
        else{
            searchstring=this.props.location.search
        }

        let mystate=queryString.parse(searchstring)
        if(mystate.sort=="unanswered")
        {
            unansweredcolor="white"
        }
        else if(mystate.sort=="closed")
        {
            closedcolor="white"
        }
        else if(mystate.sort=="answered")
        {
            answeredcolor="white"
        }
        else if(mystate.sort=="open")
        {
            opencolor="white"
        }


        return(
            <div>
            <form onSubmit={this.handleSubmit} >
                <div class="container">
                Orderby: &ensp;     
                    <select id="sel1" name="ordering" onChange={this.handleInputChange3}>
                        <option value="" selected disabled hidden>Select Sort</option>
                        <option value="-votes">Descending votes</option>
                        <option value="-created">Descending created</option>
                        <option value="votes">Ascedning votes</option>
                        <option value="created">Ascending created</option>
                    </select>
                <span>&ensp;</span>
                <input type="text" placeholder="Search.." name="search" value={this.state.search} onChange={this.handleInputChange2}/>
                <button type="submit" ><i class="fa fa-search"></i></button>&ensp;
                Title     <input type="radio" name="filter" value="title" checked={this.state.filter==="title"} onChange={e => this.handleInputChange(e)}  ></input><span>     </span>
             Body      <input type="radio" name="filter" value="body" checked={this.state.filter==="body"} onChange={e => this.handleInputChange(e)} ></input><span>     </span>
             User      <input type="radio" name="filter" value="user__username" checked={this.state.filter==="user__username"} onChange={e => this.handleInputChange(e)} ></input>
                    {/* Title     <input type="radio" name="filter" value="title" checked={this.state.filter==="title"} onChange={e => this.handleInputChange(e)}  ></input><span>     </span>
                    Body      <input type="radio" name="filter" value="search" checked={this.state.filter==="search"} onChange={e => this.handleInputChange(e)} ></input><span>     </span>
                    User      <input type="radio" name="filter" value="user__username" checked={this.state.filter==="user__username"} onChange={e => this.handleInputChange(e)} ></input> */}
                    {/* Ordering:  votes  <input type="radio" name="ordering1" value="-votes" checked={this.state.ordering=="-votes"} onChange={e => this.handleInputChange(e)}></input> */}
                </div>
            </form>
            <br/>
            <a href="/forum?sort=answered" style={{backgroundColor:answeredcolor}}>answered</a>&ensp;
            <a href="/forum?sort=unanswered" style={{backgroundColor:unansweredcolor}}>unanswered</a>&ensp;
            <a href="/forum?sort=open" style={{backgroundColor:opencolor}}>open</a>&ensp;
            <a href="/forum?sort=closed" style={{backgroundColor:closedcolor}}>closed</a>
            </div>
        );
    }
}
 {/* <input type="text" id="title" name="search" class="form-control" placeholder="Search" onChange={this.handleInputChange}/>
                    <button class="btn btn-primary" >Search</button> */}
export default SearchBar;