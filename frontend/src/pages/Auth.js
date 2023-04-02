import React, { Component } from 'react';
import './Auth.css';

class AuthPage extends Component {
    constructor(props) {
        super(props);
        this.emailEle = React.createRef();
        this.passwordEle = React.createRef()
    }

    submitHandler = (e) => {
        e.preventDefault()
        const email = this.emailEle.current.value
        const password = this.passwordEle.current.value

        if (email.trim().length === 0 || password.trim().length === 0) {
            return
        }

        const requestBody = {
            query: `
                mutation {
                    createUser(userInput: {email: "${email}", password: "${password}"}) {
                        _id
                        email
                    }
                }
            `
        }

        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                console.log(res.status)
                throw new Error('Fatal Failure')
            }
            return res.json()
        }).then(resData => {
            console.log(resData)
        }).catch(err => {
            console.log(err)
        })

    }



    render() {
        return (<>
            <h1>Auth Page</h1>
            <form className='auth-form' onSubmit={this.submitHandler}>
                <div className='form-control'>
                    <label htmlFor='email'>E-Mail</label>
                    <input type='email' id="email" ref={this.emailEle} />
                </div>
                <div className='form-control'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id="password" ref={this.passwordEle} />
                </div>
                <div className='form-actions'>
                    <button type='submit'>Submit</button>
                    <button type='button'>Signup</button>
                </div>
            </form>
        </>
        )
    }
}

// function AuthPage() {
//     return <h1>test</h1>
// }

export default AuthPage
