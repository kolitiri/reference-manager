import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'

import {
	Col, Container, Row
} from 'react-bootstrap'
import { Link } from 'react-router-dom';

import '../styles/Home.css'
import logo from '../icons/logo-black.svg'
import elasticsearch from '../icons/elasticsearch.svg'
import fastapi from '../icons/fastapi.png'
import react from '../icons/react.svg'
import reactivesearch from '../icons/reactivesearch.png'
import mongo from '../icons/mongo.svg'
import iphonewebp from '../icons/iphone.webp'
import iphonepng from '../icons/iphone.png'


const ImgWithFallback = ({
	src,
	fallback,
	type = 'image/webp',
	...delegated
}) => {
	return (
		<picture>
			<source srcSet={src} type={type} />
			<img src={fallback} {...delegated} className="iphone-image" alt=""/>
		</picture>
	)
}

class Home extends Component {

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { t } = this.props
		return (
			<section className="home-container">
				<Container fluid>
					<Row className="first-row">
						<Col className="d-xs-none d-sm-none d-md-none d-xl-block" xl="1"></Col>
						<Col xs="12" sm="12" md="12" xl="3">
							<div className="first-row-left vertical-align">
								<span>
									<div>
										<h1>
											<b>
												{t('home.firstrow.left.title')}
											</b>
										</h1>
									</div>
									<div>
										{t('home.firstrow.left.text')}
									</div>
								</span>
							</div>
						</Col>
						<Col xs="12" sm="12" md="12" xl="4">
							<div className="first-row-middle vertical-align">
								<Link to={'/search'} className="nav-link">
									<img
										src={logo}
										className="centered-logo "
										alt="logo"
									/>
								</Link>
							</div>
						</Col>
						<Col xs="12" sm="12" md="12" xl="3">
							<div className="first-row-right vertical-align">
								<span>
									<div>
										<h1>
											<b>
												{t('home.firstrow.right.title')}
											</b>
										</h1>
									</div>
									<div>
										{t('home.firstrow.right.text')}
									</div>
								</span>
							</div>
						</Col>
						<Col className="d-xs-none d-sm-none d-md-none d-xl-block" xl="1" ></Col>
					</Row>
				</Container>

				<Container fluid>
					<Row className="second-row">
						<Col className="d-xs-none d-sm-none d-md-block d-xl-block" md="2" xl="3" ></Col>
						<Col xs="12" sm="12" md="8" xl="6">
							<div className="iphone-image-text">
								<div>
									<div>
										<h1>
											<b>
												{t('home.secondrow.title')}
											</b>
										</h1>
									</div>
								</div>
								<div>
									{t('home.secondrow.text')}
								</div>
							</div>
							<div className="second-row-middle vertical-align">
								<ImgWithFallback
									src={iphonewebp}
									fallback={iphonepng}
									alt="logo"
								/>
							</div>
						</Col>
						<Col className="d-xs-none d-sm-none d-md-block d-xl-block" md="2" xl="3" ></Col>
					</Row>
				</Container>

				<Container fluid>
					<Row className="third-row">
						<Col xs="1" sm="1" md="2" xl="1"></Col>
						<Col xs="12" sm="12" md="8" xl="6">
							<div className="third-row-left vertical-align">
								<div>
									<div>
										<h1>
											<b>
												{t('home.third.title')}
											</b>
										</h1>
									</div>
									<div>
										{t('home.third.p1')}
									</div>
									<div>
										{t('home.third.p2')}
									</div>
									<div>
										<b>
											{t('home.third.p3')}
										</b>
									</div>
								</div>
							</div>
						</Col>
						<Col className="d-xs-none d-sm-none d-md-block d-xl-block" md="2" xl="5"></Col>
					</Row>
				</Container>

				<Container fluid>
					<Row className="fourth-row">
						<Col className="d-xs-none d-sm-none d-md-block d-xl-block" md="2" xl="3" ></Col>
						<Col xs="12" sm="12" md="8" xl="6">
							<div>
								<div>
									<div>
										<h1>
											<b>
												{t('home.fourth.title')}
											</b>
										</h1>
									</div>
								</div>
								<div>
									<p>
										{t('home.fourth.p1')}
									</p>
								</div>
								<div>
									<p>
										{t('home.fourth.p2')}
									</p>
									<p>
										<span role='img' aria-label="partyingFace">🥳</span>&nbsp;
										<span role='img' aria-label="partyPopper">🎉</span>&nbsp;
										<span role='img' aria-label="partyingFace">🥳</span>&nbsp;
										<span role='img' aria-label="partyPopper">🎉</span>
									</p>
								</div>
							</div>
						</Col>
						<Col className="d-xs-none d-sm-none d-md-block d-xl-block" md="2" xl="3" ></Col>
					</Row>
				</Container>

				<Container>
					<div className="powered">
						<div>
							<h1>
								<b>
									{t('home.fifth.title')}
								</b>
							</h1>
						</div>
					</div>
					<Row className="fifth-row">
						<Col xs="12" sm="12" md="3" xl="4">
							<div className="vertical-align">
								<a href="https://opensource.appbase.io/reactive-manual/getting-started/reactivebase.html" target="_blank" rel="noopener noreferrer">
									<img
										src={reactivesearch}
										className="reactivesearch-icon"
										alt="logo"
									/>
								</a>
							</div>
						</Col>
						<Col xs="12" sm="12" md="6" xl="4">
							<div className="vertical-align">
								<a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer">
									<img
										src={fastapi}
										className="fastapi-icon"
										alt="logo"
									/>
								</a>
							</div>
						</Col>
						<Col xs="12" sm="12" md="3" xl="4">
							<div className="vertical-align">
								<a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">
									<img
										src={mongo}
										className="mongo-icon"
										alt="logo"
									/>
								</a>
							</div>
						</Col>
					</Row>
				</Container>

				<Container>
					<Row className="sixth-row">
						<Col className="d-xs-none d-sm-none d-md-block d-xl-block" md="1" xl="2"></Col>
						<Col xs="12" sm="12" md="5" xl="4">
							<div className="vertical-align">
								<a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
									<img
										src={react}
										className="react-icon"
										alt="logo"
									/>
								</a>
							</div>
						</Col>
						<Col xs="12" sm="12" md="5" xl="4">
							<div className="vertical-align">
								<a href="https://www.elastic.co/" target="_blank" rel="noopener noreferrer">
									<img
										src={elasticsearch}
										className="elasticsearch-icon"
										alt="logo"
									/>
								</a>
							</div>
						</Col>
						<Col className="d-xs-none d-sm-none d-md-block d-xl-block" md="1" xl="2"></Col>
					</Row>
				</Container>
			</section>
		)
	}
}

export default withTranslation()(Home);