import 'remixicon/fonts/remixicon.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import "./style/utils.css"
import "./style/root.css"
import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from './components/navbar/Navbar'
import { AppRoutes } from './routes/App.routes'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

function App() {
  // handle nav bar appearance for registration page
  const [navbar, setNavbar] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname?.includes('/auth/')) setNavbar(false);
    else {
      setNavbar(true)
    }
  }, [location])

  // Handle theme load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === null) {
      document.body.classList.add('dark-theme');
    }
  }, [])

  return (
    <>
      {navbar && <header className='hb-header'>
        <Navbar />
      </header>}
      <main>
        <AppRoutes />
      </main>
      <footer className='text-center hb-text-fade m-2'>
        <div className='d-flex align-items-center gap-1 justify-content-center'>
          <span>hostelbetting.fun&copy;2024</span>
          <i className="bi bi-dot"></i>
          <Link to="/privacy" target='_blank' className='hb-url-hovcolor'>privacy policy</Link>
          <i className="bi bi-dot"></i>
          <a href="/contact" className='hb-url-hovcolor'>contact</a>
        </div>
      </footer>

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={'dark'}
        className={'text-center'}
      />
    </>
  );
}



export default App;
