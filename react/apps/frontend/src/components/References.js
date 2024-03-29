import React, { Component } from 'react';

import { withTranslation } from 'react-i18next'
import {
	Alert, Button, Col, Container, Dropdown,
	DropdownButton, Form, ListGroup, Popover,
	OverlayTrigger, Row, Tab, Tabs
} from 'react-bootstrap'

import { IoIosTrash, IoMdCreate, IoMdInformationCircle } from "react-icons/io";

import '../styles/References.css'


class References extends Component {

	state = {
		producerInsertEndpoint: this.props.producerInsertEndpoint,
		producerEditReferenceEndpoint: this.props.producerEditReferenceEndpoint,
		producerDeleteEndpoint: this.props.producerDeleteEndpoint,
		producerReferencesEndpoint: this.props.producerReferencesEndpoint,
		producerCaregoriesEndpoint: this.props.producerCaregoriesEndpoint,
		producerBookmarksEndpoint: this.props.producerBookmarksEndpoint,
		activeTab: "bookmarked",
		editReference: false,
		isAuthor: this.props.isAuthor,
		categories: [],
		references: [],
		bookmarkedReferences: [],
		currentReferenceId: null,
		books: {},
		currentBook: '',
		currentBookAuthor: '',
		currentSections: {},
		title: null,
		category: null,
		description: null,
		referencesLoading: true,
		bookmarkedReferencesLoading: true,
		error: null
	}

	componentDidMount() {
		window.scrollTo(0, 0);

		const { t } = this.props

		if ( this.props.isAuthor ) {
			this.getReferences()
		}

		this.getBookmarkedReferences()

		const categoriesRequest = {
			method: 'GET',
		}

		fetch(this.state.producerCaregoriesEndpoint, categoriesRequest)
		.then(response => response.json())
		.then(data => this.setCategories(data))
		.catch(err => {
			this.addError(t('references.error.genericerror'))
		})
	}

	setCategories = (data) => {
		var categories = []

		data['categories'].forEach(category => {
			categories.push(category)
		})

		this.setState({
			categories: categories,
		})
	}

	addError = (error) => {
		this.setState({
			error: error,
		})
	}

	handleTitleChange = (event) => {
		this.setState({
			title: event.target.value,
		})
	}

	handleCategoryChange = (eventKey) => {
		this.setState({
			category: this.state.categories[eventKey]
		})
	}

	handleDescriptionChange = (event) => {
		this.setState({
			description: event.target.value,
		})
	}

	handleBookChange = (event) => {
		this.setState({
			currentBook: event.target.value,
		})
	}

	handleBookAuthorChange = (event) => {
		this.setState({
			currentBookAuthor: event.target.value,
		})
	}

	handleStartingPageChange = (event, bookname) => {
		var currentSections = this.state.currentSections
		currentSections[bookname].startingPage = event.target.value

		this.setState({
			currentSections: currentSections,
		})
	}

	handleEndingPageChange = (event, bookname) => {
		var currentSections = this.state.currentSections
		currentSections[bookname].endingPage = event.target.value

		this.setState({
			currentSections: currentSections,
		})
	}

	addBook = () => {
		const { t } = this.props
		var books = this.state.books

		if (this.state.currentBook === null || this.state.currentBook === '') {
			this.addError(t("references.form.error.bookname"))
			return
		}

		if (this.state.currentBookAuthor === null || this.state.currentBookAuthor === '') {
			this.addError(t("references.form.error.bookauthor"))
			return
		}

		books[this.state.currentBook] = {
			author: this.state.currentBookAuthor,
			sections: []
		}

		var currentSections = this.state.currentSections
		currentSections[this.state.currentBook] = {
			startingPage: '',
			endingPage: ''
		}

		this.setState({
			books: books,
			currentBook: '',
			currentBookAuthor: '',
			currentSections: currentSections,
		})
	}

	removeBook = (bookName) => {
		var books = this.state.books

		delete books[bookName]

		this.setState({
			books: books,
		})
	}

	addSection = (bookName) => {
		const { t } = this.props
		var books = this.state.books
		var currentBook = books[bookName]

		var currentSections = this.state.currentSections
		var startingPage = parseFloat(currentSections[bookName].startingPage)
		var endingPage = parseFloat(currentSections[bookName].endingPage)

		if (!Number.isInteger(startingPage) || !Number.isInteger(endingPage)) {
			this.addError(t('references.form.error.pagenumber'))
			return
		}

		if (startingPage < 0 || endingPage < 0) {
			this.addError('references.form.error.pagepositivenumber')
			return
		}

		if (startingPage > endingPage) {
			this.addError(t('references.form.error.startingpagegt'))
			return
		}

		currentBook.sections.push(
			{
				starting_page: startingPage,
				ending_page: endingPage,
			}
		)

		currentSections[bookName] = {
			startingPage: '',
			endingPage: ''
		}

		this.setState({
			books: books,
			currentSections: currentSections,
		})
	}

	addReference = (event) => {
		const { t } = this.props
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (this.state.category === null || this.state.category === '') {
			this.addError(t('references.form.error.category'))
			return
		}

		if (this.state.title === null || this.state.title === '') {
			this.addError(t('references.form.error.title'))
			return
		}

		if (this.state.title.length < 5) {
			this.addError(t('references.form.error.titleshort'))
			return
		}

		if (this.state.title.length > 100) {
			this.addError(t('references.form.error.titlelong'))
			return
		}

		if (this.state.description === null || this.state.description === '') {
			this.addError(t('references.form.error.description'))
			return
		}

		if (this.state.description.length < 30) {
			this.addError(t('references.form.error.descriptionshort'))
			return
		}

		if (this.state.description.length > 600) {
			this.addError(t('references.form.error.descriptionlong'))
			return
		}

		if (Object.keys(this.state.books).length === 0) {
			this.addError(t('references.form.error.book'))
			return
		}

		for (let book in this.state.books) {
			const author = this.state.books[book]['author']

			if (book.length < 5) {
				this.addError(t('references.form.error.bookshort'))
				return
			}
			if (book.length > 100) {
				this.addError(t('references.form.error.booklong'))
				return
			}
			if (author.length < 5) {
				this.addError(t('references.form.error.authorshort'))
				return
			}
			if (author.length > 50) {
				this.addError(t('references.form.error.authorlong'))
				return
			}
		}

		var booksList = []
		for (const [ name, detail ] of Object.entries(this.state.books)) {

			if (detail.sections.length === 0) {
				this.addError(t('references.form.error.section'))
				return
			}

			booksList.push({
				name: name,
				author: detail.author,
				book_sections: detail.sections,
			})
		}

		var endpoint
		var reference
		if (this.state.editReference) {
			var references = this.state.references
			var existingReferenceId = this.state.currentReferenceId
			var existingReference = references.filter(
				reference => reference.reference_id === existingReferenceId
			)[0]
			reference = {
				reference_id: existingReference['reference_id'],
				title: this.state.title,
				category: this.state.category,
				description: this.state.description,
				books: booksList,
			}
			endpoint = this.state.producerEditReferenceEndpoint
		} else {
			reference = {
				title: this.state.title,
				category: this.state.category,
				description: this.state.description,
				books: booksList,
			}
			endpoint = this.state.producerInsertEndpoint
		}

		const request = {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(endpoint, request)
		.then(response => {
			if (!response.ok) {
				if (response.status === 422) {
					this.addError(t('references.form.error.genericerror'))
				}
				if (response.status === 409) {
					this.addError(t('references.form.error.referenceexists'))
				}
				if (response.status === 404) {
					this.addError(t('references.form.error.referencedoesnotexist'))
				}
			}
			return response.json()
		})
		.then(data => {
			if (data['reference']) {
				var references = this.state.references

				if (this.state.editReference) {
					// Delete the old version of the reference from the state
					references = references.filter(
						reference => reference.reference_id !== data['reference']['reference_id']
					)
				}

				references.push(data['reference'])
				this.setState({
					references: references
				})
			}

			this.clearForm()
		})
		.catch(err => {
			// Most likely session token has expired. Redirect to home page
			window.location.href = "/?error=401"
		})
	}

	getReferences = () => {
		const { t } = this.props
		const referencesRequest = {
			method: 'GET',
			credentials: 'include',
		}

		fetch(this.state.producerReferencesEndpoint, referencesRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				references: data['references'],
				referencesLoading: false
			})
		})
		.catch(err => {
			this.addError(t('references.error.genericerror'))
		})
	}

	deleteReference = (reference) => {
		const { t } = this.props
		const request = {
			method: 'DELETE',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerDeleteEndpoint, request)
		.then(response => response.json())
		.then(data => {
			if (data.deleted) {
				var references = this.state.references
				var filteredReferences = references.filter(
					ref => ref !== reference
				)
				this.setState({
					references: filteredReferences
				})
			}
		})
		.catch(err => {
			this.addError(t('references.error.genericerror'))
		})
	}

	getBookmarkedReferences = () => {
		const { t } = this.props
		const referencesRequest = {
			method: 'GET',
			credentials: 'include',
		}

		fetch(this.state.producerBookmarksEndpoint, referencesRequest)
		.then(response => response.json())
		.then(data => {
			this.setState({
				bookmarkedReferences: data['bookmarkedReferences'],
				bookmarkedReferencesLoading: false
			})
		})
		.catch(err => {
			this.addError(t('references.error.genericerror'))
		})
	}

	removeBookmark = (reference) => {
		const deleteBookmarkRequest = {
			method: 'DELETE',
			credentials: 'include',
			body: JSON.stringify(reference)
		}

		fetch(this.state.producerBookmarksEndpoint, deleteBookmarkRequest)
		.then(response => response.json())
		.then(data => {
			if ( data.success ) {
				var bookmarkedReferences = this.state.bookmarkedReferences
				var filteredBookmarkedReferences = bookmarkedReferences.filter(
					ref => ref.reference_id !== reference.reference_id
				)
				this.setState({
					bookmarkedReferences: filteredBookmarkedReferences,
				})
			}
		})
		.catch(err => console.log(err))
	}

	clearForm = () => {
		this.setState({
			books: {},
			currentBook: "",
			currentSections: {},
			title: "",
			category: "",
			description: "",
			editReference: false,
			currentReferenceId: null,
		})
	}

	changeTab = (eventKey) => {
		if (eventKey !== "addReference") {
			this.clearForm()
		}
		this.setState({
			activeTab: eventKey
		})
	}

	handleEdit = (reference) => {
		var books = {}
		var currentSections = {}

		Object.keys(reference.books).forEach(function(bookIndex) {
			var bookName = reference.books[bookIndex].name
			var sections = []

			Object.keys(reference.books[bookIndex].book_sections).forEach(function(sectionIndex) {
				sections.push(
					{
						starting_page: reference.books[bookIndex].book_sections[sectionIndex].starting_page,
						ending_page: reference.books[bookIndex].book_sections[sectionIndex].ending_page
					}
				)

				currentSections[bookName] = {
					startingPage: '',
					endingPage: ''
				}
			})

			books[bookName] = {
				author: reference.books[bookIndex].author,
				sections: sections,
			}
		})

		this.setState({
			category: reference.category,
			title: reference.title,
			description: reference.description,
			books: books,
			currentBook: '',
			currentBookAuthor: '',
			currentSections: currentSections,
			editReference: true,
			currentReferenceId: reference.reference_id,
		})

		this.changeTab("addReference")
	}

	render() {
		const { t } = this.props

		const popover = (
			<Popover id="popover-basic" className="responsive-text">
				<Popover.Title as="h3">Tips</Popover.Title>
				<Popover.Content>
					<p>
						1. {t('references.tips.p1')}
					</p>
					<p>
						2. {t('references.tips.p2')}
					</p>
					<p>
						3. {t('references.tips.p3')}
					</p>
				</Popover.Content>
			</Popover>
		)

		return (
			<Container className="responsive-text" style={{"marginTop": "20px"}}>
				<Tabs activeKey={this.state.activeTab} onSelect={(eventKey) => this.changeTab(eventKey)} className="reference-tabs">
					<Tab eventKey="bookmarked" title={t('references.bookmarked')}>
						<div>
							<Row>
								<Col>
									<br/>
									{this.state.bookmarkedReferences.length === 0 ? <span>{t('references.noreferences')}</span> : null}
								</Col>
							</Row>

							<Row>
								<Col>
									{this.state.bookmarkedReferencesLoading ? null : (
										<ListGroup variant="flush">
											{this.state.bookmarkedReferences.map((reference, index) => (
												<ListGroup.Item key={index}>
													<div>
														<Row className="text-right">
															<Col>
																<b>{t('references.categories.' + reference.category)}</b>
															</Col>
														</Row>
														<Row >
															<Col>
																<h2>{reference.title}</h2>
															</Col>
														</Row>
														<br/>
														<Row>
															<Col className="text-left">
																{reference.description}
															</Col>
														</Row>
														<Row>
															<Col>
																<ListGroup>
																{reference.books.map(({ name, author, book_sections }, bookIndex) => (
																	<ListGroup.Item style={{border: "none"}} key={bookIndex}>
																		<div>
																			<b>{name}</b> - <span>{author}</span>
																		</div>
																		<div>
																			{book_sections.map(({ starting_page, ending_page }, sectionsIndex) => (
																				<span key={sectionsIndex}>|{starting_page}-{ending_page}| </span>
																			))}
																		</div>
																	</ListGroup.Item>
																))}
																</ListGroup>
															</Col>
														</Row>
														<Row>
															<Col>
																<Button
																	className="float-right"
																	size="sm"
																	variant="danger"
																	onClick={() => this.removeBookmark(reference)}
																>
																	<IoIosTrash/>
																</Button>
															</Col>
														</Row>
													</div>
													<br/>
												</ListGroup.Item>
											))}
										</ListGroup>
									)}
								</Col>
							</Row>
						</div>
					</Tab>
					{this.state.isAuthor ?
					<Tab eventKey="references" title={t('references.myreferences')}>
						<div>
							<Row>
								<Col>
									<br/>
									{this.state.references.length === 0 ? <span>{t('references.noreferences')}</span> : null}
								</Col>
							</Row>

							<Row>
								<Col>
									{this.state.referencesLoading ? null :
										<ListGroup variant="flush">
											{this.state.references.map((reference, index) => (
												<ListGroup.Item key={index}>
													<div>
														<Row className="text-right">
															<Col>
																<b>{t('references.categories.' + reference.category)}</b>
															</Col>
														</Row>
														<Row >
															<Col>
																<h2>{reference.title}</h2>
															</Col>
														</Row>
														<br/>
														<Row>
															<Col className="text-left">
																{reference.description}
															</Col>
														</Row>
														<Row>
															<Col>
																<ListGroup>
																{reference.books.map(({ name, author, book_sections }, bookIndex) => (
																	<ListGroup.Item style={{border: "none"}} key={bookIndex}>
																		<div>
																			<b>{name}</b> - <span>{author}</span>
																		</div>
																		<div>
																			{book_sections.map(({ starting_page, ending_page }, sectionsIndex) => (
																				<span key={sectionsIndex}>|{starting_page}-{ending_page}| </span>
																			))}
																		</div>
																	</ListGroup.Item>

																))}
																</ListGroup>
															</Col>
														</Row>
														<Row>
															<Col>
																<Button
																	className="float-right"
																	size="sm"
																	variant="danger"
																	style={{"marginLeft": "10px"}}
																	onClick={() => this.deleteReference(reference)}
																>
																	<IoIosTrash/>
																</Button>
																<Button
																	className="float-right"
																	size="sm"
																	variant="secondary"
																	onClick={() => this.handleEdit(reference)}
																>
																	<IoMdCreate/>
																</Button>
															</Col>
														</Row>
													</div>
													<br/>
												</ListGroup.Item>
											))}
										</ListGroup>
									}
								</Col>
							</Row>
						</div>
					</Tab> : null
					}
					{this.state.isAuthor ?
					<Tab eventKey="addReference" title={this.state.editReference ? "Edit" : t('references.addreference')}>
						<br/>
							{this.state.error ?
								<Alert variant="danger" onClose={() => this.addError(null)} dismissible>
									{this.state.error}
								</Alert> : null
							}
						<Form>
							<Form.Row>
								<Form.Group as={Col} controlId="categoryValidation">
									<DropdownButton
										size="sm"
										variant="secondary"
										id="dropdown-basic-button"
										title={this.state.category ? t('search.categories.' + this.state.category) : t('references.form.category')}
									>
										{this.state.categories.map((category, index) => (
											<Dropdown.Item
												key={index}
												eventKey={index}
												onSelect={(eventKey, event) => this.handleCategoryChange(eventKey)}
											>
												{t('search.categories.' + category)}
											</Dropdown.Item>
										))}
									</DropdownButton>
								</Form.Group>
								<Form.Group as={Col} controlId="information">
									<OverlayTrigger trigger="click" placement="left" overlay={popover}>
										<div className="float-right information-button">
											<IoMdInformationCircle/>
										</div>
									</OverlayTrigger>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="titleValidation">
									<Form.Control
										required
										type="text"
										onChange={this.handleTitleChange}
										value={this.state.title || ""}
										placeholder={t('references.form.title')}
									/>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} controlId="descriptionValidation">
									<Form.Control
										required
										as="textarea"
										rows="5"
										value={this.state.description || ""}
										onChange={this.handleDescriptionChange}
										placeholder={t('references.form.description')}
									/>
								</Form.Group>
							</Form.Row>

							<Form.Row>
								<Form.Group as={Col} sm="4" md="5">
									<Form.Control
										type="text"
										value={this.state.currentBook || ""}
										onChange={this.handleBookChange}
										placeholder={t('references.form.booktitle')}
									/>
								</Form.Group>
								<Form.Group as={Col} sm="4" md="5">
									<Form.Control
										type="text"
										value={this.state.currentBookAuthor || ""}
										onChange={this.handleBookAuthorChange}
										placeholder={t('references.form.bookauthor')}
									/>
								</Form.Group>

								<div as={Col} sm="4" md="2">
									<Button variant="link" onClick={this.addBook}>{t('references.form.addbook')}</Button>
								</div>
							</Form.Row>

							<Form.Row>
								<Col>
									<ListGroup as={Col}>
										{Object.entries(this.state.books).map(([bookName, details], bookIndex) => (
											<ListGroup.Item key={bookIndex}>
												<Form.Row>
												<Container>
													<Row>
														<Col xs={10} className="limited-text">
															<b>{t('references.form.book')}:</b> {bookName}
														</Col>
														<Col xs={2}>
															<Button
																className="float-right"
																size="sm"
																variant="danger"
																onClick={() => this.removeBook(bookName)}
															>
																<IoIosTrash/>
															</Button>
														</Col>
													</Row>
												</Container>
												</Form.Row>
												<Form.Row>
												<Container>
													<Row>
														<Col className="limited-text">
															<b>{t('references.form.author')}: </b> {details.author}
														</Col>
													</Row>
												</Container>
												</Form.Row>
												<Form.Row>
												<Container fluid>
													<Row>
														<Col className="limited-text">
															<div className="limited-text"><b>{t('references.form.pages')}: </b>
															{details.sections.map(({ starting_page, ending_page }, sectionIndex) => (
																<span key={sectionIndex}>|{starting_page}-{ending_page}| </span>
															))}
															</div>
														</Col>
													</Row>
												</Container>
												</Form.Row>
												<hr/>
												<Form.Row>
													<Form.Group as={Col} sm="4" md="2" controlId="startingPageValidation">
														<Form.Control
															type="number"
															min="0"
															value={this.state.currentSections[bookName].startingPage}
															onChange={(event) => this.handleStartingPageChange(event, bookName)}
															placeholder={t('references.form.startingpage')}
														/>
													</Form.Group>

													<Form.Group as={Col} sm="4" md="2" controlId="endingPageValidation">
														<Form.Control
															type="number"
															min="0"
															value={this.state.currentSections[bookName].endingPage}
															onChange={(event) => this.handleEndingPageChange(event, bookName)}
															placeholder={t('references.form.endinggpage')}
														/>
													</Form.Group>

													<div as={Col} sm="4" md="2">
														<Button variant="link" onClick={() => this.addSection(bookName)}>{t('references.form.addsection')}</Button>
													</div>
												</Form.Row>
											</ListGroup.Item>
										))}
									</ListGroup>
								</Col>
							</Form.Row>
							<hr/>
							<Form.Row>
								<Col>
									<Button size="sm" variant="outline-dark" onClick={this.addReference}>{t('references.form.save')}</Button>
								</Col>
							</Form.Row>
						</Form>
					</Tab> : null
					}
				</Tabs>
			</Container>
		);
	}
}

export default withTranslation()(References);