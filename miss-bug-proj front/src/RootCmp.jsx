
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { UserIndex } from './pages/UserIndex.jsx'
import { userService } from './services/user.service.js'

import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom'

export function App() {

  function RouteGuard({ children }) {
    const loggedinUser = userService.getLoggedinUser()

    function isAllowed() {
        return loggedinUser?.isAdmin
    }

    if (!isAllowed()) return <Navigate to="/" />
    return children
  }

  return (
    <Router>
      <div>
        <AppHeader />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/bug' element={<BugIndex />} />
            <Route path='/bug/:bugId' element={<BugDetails />} />
            <Route path='/user' element={
              <RouteGuard >
                <UserIndex />
              </RouteGuard>
            } ></Route>
            <Route path='/about' element={<AboutUs />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  )
}
