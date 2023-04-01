import React from 'react'
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainNavigation />
        <main className='main-content'>
          <Switch>
            <Redirect from="/" to="/auth" exact />
            {/* <Route path="/" component={null} exact /> */}
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
