import React, { Component } from 'react';

import Search from './Search';
import Login from './Login';
import References from './References';
import JoinUs from './JoinUs';

import {
	Alert, Container, Navbar, Nav
} from 'react-bootstrap'

import '../styles/App.css'


class App extends Component {

	state = {
		userLoggedIn: false,
		userName: null,
		permissions: [],
		producerLoginRedirectEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_REDIRECT_ENDPOINT,
		producerLoginEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_ENDPOINT,
		producerLogoutEndpoint: process.env.REACT_APP_PRODUCER_LOGOUT_ENDPOINT,
		producerLoginCheckEndpoint: process.env.REACT_APP_PRODUCER_LOGIN_CHECK_ENDPOINT,
		producerInsertEndpoint: process.env.REACT_APP_PRODUCER_INSERT_ENDPOINT,
		producerDeleteEndpoint: process.env.REACT_APP_PRODUCER_DELETE_ENDPOINT,
		producerReferencesEndpoint: process.env.REACT_APP_PRODUCER_REFERENCES_ENDPOINT,
		producerCaregoriesEndpoint: process.env.REACT_APP_PRODUCER_CATEGORIES_ENDPOINT,
		producerJoinEndpoint: process.env.REACT_APP_PRODUCER_JOIN_ENDPOINT,
		searchOn: true,
		referencesOn: false,
		joinUsOn: false,
		isAuthor: false,
		requestedJoin: false,
		alertMessage: null,
	}

	componentDidMount() {
		this.authenticate()
	}

	authenticate = () => {
		var authToken = (window.location.search.match(/authToken=([^&]+)/) || [])[1]
		window.history.pushState('object', document.title, "/");

		if (authToken) {
			// Try to get an access token from the server
			this.getAccessToken(authToken)
		} else {
			// Check user is logged in
			this.checkUserSessionStatus()
		}
	}

	getAccessToken = (authToken) => {
		const request = {
			method: 'GET',
			headers: {
				"Authorization": "Bearer " + authToken
			},
			credentials: 'include'
		}

		fetch(this.state.producerLoginEndpoint, request)
		.then(response => {
			// Check user is logged in
			this.checkUserSessionStatus()
		})
		.then(data => console.log(data))
		.catch(err => console.log(err))
	}

	checkUserSessionStatus = () => {
		const request = {
			method: 'GET',
			credentials: 'include'
		}

		fetch(this.state.producerLoginCheckEndpoint, request)
		.then(response => response.json())
		.then(data => {
			this.setState({
				userLoggedIn: data['userLoggedIn'],
				userName: data['userName'],
				isAuthor: data['isAuthor'],
				requestedJoin: data['requestedJoin'],
			})
		})
		.catch(err => console.log(err))
	}

	logout = () => {
		const request = {
			method: 'GET',
			credentials: 'include'
		}

		fetch(this.state.producerLogoutEndpoint, request)
		.then(response => response.json())
		.then(data => {
			this.setState({
				userLoggedIn: data['userLoggedIn'],
				userName: null,
				isAuthor: null,
				requestedJoin: null,
			})
		})
		.catch(err => console.log(err))
	}

	openReferences = () => {
		this.setState({
			referencesOn: true,
			searchOn: false,
			joinUsOn: false,
		})
	}

	openSearch = () => {
		this.setState({
			referencesOn: false,
			searchOn: true,
			joinUsOn: false,
		})
	}

	openJoinus = () => {
		this.setState({
			referencesOn: false,
			searchOn: false,
			joinUsOn: true,
		})
	}

	setSearchOn = () => {
		this.setState({
			searchOn: true,
			joinUsOn: false,
		})
	}

	setRequestedJoin = (requestedJoin) => {
		this.setState({
			requestedJoin: requestedJoin,
		})
	}

	setAlert = (alertMessage) => {
		this.setState({
			alertMessage: alertMessage,
		})
	}

	render() {
		return (
			<section>
				<Navbar bg="dark" expand="md">
					<Navbar.Brand href="#" onClick={this.openSearch}>

					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
						{this.state.userLoggedIn ?
							<Nav className="mr-auto">
								{/*
								{this.state.userName ?
									<span>Hello {this.state.userName}</span> : <span></span>
								}
								*/}
								<Nav.Link style={{color:"white"}} onClick={this.openSearch}>My Account</Nav.Link>
								<Nav.Link style={{color:"white"}} onClick={this.openSearch}>Search</Nav.Link>
								{this.state.isAuthor ?
									<Nav.Link style={{color:"white"}} onClick={this.openReferences}>References</Nav.Link> : null
								}
								{!this.state.isAuthor && !this.state.requestedJoin ?
									<Nav.Link style={{color:"white"}} onClick={this.openJoinus}>Join us</Nav.Link> : null
								}

							</Nav> : null
						}
						<Nav>
							{this.state.userLoggedIn ?
								<Nav.Link style={{color:"white"}} onClick={this.logout}>Log out</Nav.Link> :
								<Login producerLoginRedirectEndpoint={this.state.producerLoginRedirectEndpoint}/>
							}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<br/>
				<Container className="search-container">
					{this.state.alertMessage ?
						<Alert variant="success" onClose={() => this.setAlert(null)} dismissible>
							<Alert.Heading>Fantastic!</Alert.Heading>
								<p>
									{this.state.alertMessage}
								</p>
						</Alert> : null
					}
					{this.state.searchOn ?
						<Search/> : null
					}
					{this.state.userLoggedIn && !this.state.isAuthor && this.state.joinUsOn ?
						<JoinUs
							producerJoinEndpoint={this.state.producerJoinEndpoint}
							setSearchOn={this.setSearchOn}
							setRequestedJoin={this.setRequestedJoin}
							setAlert={this.setAlert}
						/> : null
					}
					{this.state.userLoggedIn && this.state.referencesOn ?
						<References
							producerInsertEndpoint={this.state.producerInsertEndpoint}
							producerDeleteEndpoint={this.state.producerDeleteEndpoint}
							producerReferencesEndpoint={this.state.producerReferencesEndpoint}
							producerCaregoriesEndpoint={this.state.producerCaregoriesEndpoint}
						/> : null
					}
				</Container>

				<Container className="footer-container">
					<hr/>
					<Navbar sticky="bottom" className="justify-content-end">
						<Nav>
							<Nav.Link>About</Nav.Link>
							<Nav.Link>Contact</Nav.Link>
							<Nav.Link>Terms</Nav.Link>
						</Nav>
					</Navbar>
				</Container>
			</section>
		);
	}
}

export default App;