import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';
import {withRouter} from 'react-router'










class SearchBar extends Component{

    

    state={
        name:"search",
        search:"",
        filter:"",
    }

    constructor(props)
    {
        super(props);
        this.handleSearch=this.handleSearch.bind(this)
        this.handleInputChange=this.handleInputChange.bind(this)
        this.handleInputChange2=this.handleInputChange2.bind(this)
    }

    
    handleValueChange = (mdeState) => {
        this.setState({mdeState});
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
        return(
            <div>
            <form onSubmit={this.handleSubmit} action="/forum">
                <div class="container">
                Orderby: &ensp;     
                    <select id="sel1" name="ordering">
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
            </div>
        );
    }
}
 {/* <input type="text" id="title" name="search" class="form-control" placeholder="Search" onChange={this.handleInputChange}/>
                    <button class="btn btn-primary" >Search</button> */}
export default SearchBar;