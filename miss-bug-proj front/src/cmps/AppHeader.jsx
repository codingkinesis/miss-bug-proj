
import { useState } from 'react'
import {UserMsg} from './UserMsg'
import { NavLink } from 'react-router-dom'
import { userService } from '../services/user.service.js' //local
import { LoginSignup } from './LoginSignup'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function AppHeader() {
  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())
  
  

  async function onLogin(credentials) {
      console.log(credentials)
      try {
          const user = await userService.login(credentials)
          setLoggedinUser(user)
          showSuccessMsg(`Welcome ${user.fullname}`)
      } catch (err) {
          console.log('Cannot login :', err)
          showErrorMsg(`Cannot login`)
      }
  }

  async function onSignup(credentials) {
      console.log(credentials)
      try {
          const user = await userService.signup(credentials)
          setLoggedinUser(user)
          showSuccessMsg(`Welcome ${user.fullname}`)
      } catch (err) {
          console.log('Cannot signup :', err)
          showErrorMsg(`Cannot signup`)
      }
      // add signup
  }

  async function onLogout() {
      console.log('logout');
      try {
          await userService.logout()
          setLoggedinUser(null)
      } catch (err) {
          console.log('can not logout');
      }
      // add logout
  }

  function isAllowed() {
      return loggedinUser?.isAdmin
  }


  return (
    <header className='app-header '>
      <div className='header-container'>
        <h1>Bugs are Forever</h1>

        <section className="login-signup-container">
          {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

          {loggedinUser && <div className="user-preview">
              <h3>Hello {loggedinUser.fullname}
                  <button onClick={onLogout}>Logout</button>
              </h3>
          </div>}
        </section>

        <nav className='app-nav'>
          <NavLink to="/">Home</NavLink> |
          <NavLink to="/bug">Bugs</NavLink> |
          {isAllowed() && <NavLink to="/user">Users</NavLink> }
          {isAllowed() && '|' }
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
      <UserMsg />
    </header>
  )
}
