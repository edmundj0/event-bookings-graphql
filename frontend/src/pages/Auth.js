import React, { Component } from 'react';
import './Auth.css';

class AuthPage extends Component {
    render() {
        return (<>
            <h1>Auth Page</h1>
            <form className='auth-form'>
                <div className='form-control'>
                    <label htmlFor='email'>E-Mail</label>
                    <input type='email' id="email" />
                </div>
                <div className='form-control'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id="password" />
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
