import '../../resources/styles/register.css';
import { React, useState, useReducer } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import AccountCircle from '../../images/AccountCircle.png'
import MenuIcon from '../../images/MenuIcon.png'
import { useSignupMutation } from '../../store/reducers/authApiSlice';

// Note: Add new user mutation must be implemented
// Compare with YT tut and check why its not async

function Registerform() {

	const [user, setUser] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", clubName: "", address: "", zipCode: "", city: "", federalState: "", password: "", password: "", repeatPassword: "", role: "" });

	const [error, setError] = useState({
		firstName: '',
		lastName: '',
		email: '',
		clubName: '',
		address: '',
		zipCode: '',
		city: '',
		federalState: '',
		password: '',
		repeatPassword: ''
	})

	const [isDonor, setIsDonor] = useState(true);
	const [isRecipient, setIsRecipient] = useState(false)

	const handleOnChangeIsDonor = (e) => {
		setIsDonor(!isDonor)
		setIsRecipient(isDonor)
		setUser({ ...user, role: getRole() })
	}

	const getRole = () => {
		let role = ""
		if (isDonor === true) {
			role = "donor"
		}
		else role = "recipient"
		return role
	}

	// use mutation to post request on API
	const [addUser, { isLoading: updating, isSuccess: saved }] = useSignupMutation();


	const inputHandler = (e) => {
		const { name, value } = e.target;

		if (!isCheckox(name)) {
			setUser({ ...user, [name]: value });
		}
		validateInput(e);
	};

	const validateInput = e => {
		let { name, value } = e.target;
		setError(prev => {
			const stateObj = { ...prev, [name]: "" };

			switch (name) {
				case "firstName":
					if (!value) {
						stateObj[name] = "Please enter firstName.";
					}
					break;
				case "lastName":
					if (!value) {
						stateObj[name] = "Please enter lastName.";
					}
					break;
				case "email":
					if (!value) {
						stateObj[name] = "Please enter email.";
					}
					break;
				case "clubName":
					if (!value) {
						stateObj[name] = "Please enter clubName.";
					}
					break;

				case "password":
					if (!value) {
						stateObj[name] = "Please enter Password.";
					} else if (user.repeatPassword && value !== user.repeatPassword) {
						stateObj["repeatPassword"] = "Password and Confirm Password does not match.";
					} else {
						stateObj["repeatPassword"] = user.repeatPassword ? "" : error.repeatPassword;
					}
					break;

				case "repeatPassword":
					if (!value) {
						stateObj[name] = "Please enter Confirm Password.";
					} else if (user.password && value !== user.password) {
						stateObj[name] = "Password and Confirm Password does not match.";
					}
					break;

				default:
					break;
			}

			return stateObj;
		});
	}



	const isCheckox = (name) => {
		if (name == "user-type-donor" || name == "user-type-recipient") return true
		return false
	}


	const saveUser = (e) => {

		e.preventDefault();
		setUser({ ...user, role: getRole() })

		try {
			addUser({ first_name: user.firstName, last_name: user.lastName, email: user.email, phone: user.phoneNumber, street: user.address, zip_code: user.zipCode, city: user.city, region: user.federalState, password: user.password, role: getRole(), club_name: user.clubName }).unwrap()
		} catch (err) {
			console.log("failed to post user", err)
		}

		// goBack(700);
	}

	return (
		<div>
			<Container>
				<Row className="d-flex justify-content-center align-items-center">
					<Col md={8} lg={6} xs={12}>
						<div className="form-card">

							<div className="">
								<div className="form-header">
									<img src={MenuIcon} className="icon"></img>
									<h2 className="text-uppercase ">
										Dein Konto
									</h2>
									<img src={AccountCircle} className="icon"></img>
								</div>
								<div className="form-body">
									<div className="mb-10">Um deine Angaben für die nächsten Spenden zu speichern, erstelle gerne ein Benutzerkonto.   </div>
									<Form onSubmit={saveUser}>
										<Form.Check
											type="checkbox"
											id="user-type-donor"
											name="user-type-donor"
											label="Ich möchte spenden"
											checked={isDonor}
											onChange={handleOnChangeIsDonor}
										/>
										<Form.Check
											type="checkbox"
											id="user-type-recipient"
											name="user-type-recipient"
											label="Ich suche Spenden"
											checked={isRecipient}
											onChange={handleOnChangeIsDonor}
										/>
										<Row>
											<Col sm={6} md={6}>
												<Form.Group className="mb-1 flex-col" controlId="firstName">
													<label>Vorname *</label>
													<input className="form-input-grey"
														type="text"
														id='firstName'
														name='firstName'
														onChange={inputHandler}
													></input>
													{error.firstName && <span className='err'>{error.firstName}</span>}
												</Form.Group>
											</Col>
											<Col sm={6}>
												<Form.Group className="mb-1 flex-col" controlId="lastName">
													<label>Nachname *</label>
													<input className="form-input-grey"
														type="text"
														id='lastName'
														name='lastName'
														onChange={inputHandler}
													></input>
													{error.lastName && <span className='err'>{error.lastName}</span>}
												</Form.Group>
											</Col>
										</Row>

										<Form.Group className="mb-1 flex-col" controlId="email">
											<label>E-Mail-Adresse *</label>
											<input className="form-input-grey"
												type="email"
												id='email'
												name='email'
												onChange={inputHandler}
											></input>
										</Form.Group>

										<Form.Group className="mb-1 flex-col" controlId="phone">
											<label>Telefonnummer</label>
											<input className="form-input-grey"
												type="tel"
												id='phoneNumber'
												name='phoneNumber'
												onChange={inputHandler}
											></input>
										</Form.Group>

										<Form.Group className="mb-1 flex-col" controlId="club">
											<label>Vereinsname / Organnisationsname *</label>
											<input className="form-input-grey"
												type="text"
												id='clubName'
												name='clubName'
												onChange={inputHandler}
											></input>
										</Form.Group>
										<Form.Group className="mb-1 flex-col" controlId="address">
											<label>Straße und Hausnummer *</label>
											<input className="form-input-grey"
												type="text"
												id='address'
												name='address'
												onChange={inputHandler}
											></input>
										</Form.Group>

										<Row>
											<Col md={4}>
												<Form.Group className="mb-1 flex-col" controlId="zipCode">
													<label>PLZ *</label>
													<input className="form-input-grey"
														type="number"
														id='zipCode'
														name='zipCode'
														onChange={inputHandler}
													></input>
												</Form.Group>
											</Col>
											<Col md={6}>
												<Form.Group className="mb-1 flex-col" controlId="city">
													<label>Stadt *</label>
													<input className="form-input-grey"
														type="text"
														id='city'
														name='city'
														onChange={inputHandler}
													></input>
												</Form.Group>
											</Col>
										</Row>
										<Col >
											<Form.Group className="mb-1 flex-col" controlId="federalState">
												<label>Bundesland *</label>
												<input className="form-input-grey"
													type="text"
													id='federalState'
													name='federalState'
													onChange={inputHandler}
												></input>
											</Form.Group>
										</Col>
										<Form.Group className="mb-1 flex-col" controlId="password">
											<label>Password *</label>
											<input className="form-input-grey"
												type="password"
												id='password'
												name='password'
												onChange={inputHandler}
												onBlur={validateInput}
											></input>
											{error.password && <span className='err'>{error.password}</span>}
										</Form.Group>
										<Form.Group className="mb-1 flex-col" controlId="password">
											<label>Password wiederholen *</label>
											<input className="form-input-grey"
												type="password"
												id='repeatPassword'
												name='repeatPassword'
												onChange={inputHandler}
												onBlur={validateInput}
											></input>
											{error.repeatPassword && <span className='err'>{error.repeatPassword}</span>}
										</Form.Group>
										<Button type="submit" bsPrefix='button-pink align-self-right' className='button-pink'> {updating ? "Konto wird erstellt ..." : "Konto erstellen"}</Button>
									</Form>
								</div>
							</div>

						</div>
					</Col>
				</Row>
			</Container >
		</div >
	)


}
export default Registerform;
