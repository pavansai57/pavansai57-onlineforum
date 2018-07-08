import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';

class Search extends Component{

    
    constructor(props)
    {
        super(props);
        this.handleSearch=this.handleSearch.bind(this)
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

    handleSearch(event)
    {
        this.props.location.history.push(`/forum?${this.state.search}`)
    }

    componentDidMount()
    {

    }

    componentWillMount()
    {

    }

    render()
    {
        return
        (
            <div>
                <form onSubmit={this.handleSubmit}>
                <input type="text" name="search" onChange={this.handleInputChange} />
                <button type="button" >Search</button>
                </form>                   
            </div>
        )
    }

}