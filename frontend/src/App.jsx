import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyApplications from './pages/MyApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import InterviewerEvaluation from './pages/InterviewerEvaluation';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import PageWrapper from './components/PageWrapper';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Session-based splash check
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Role-based redirection
    if (userData.role === 'RECRUITER' || userData.role === 'ADMIN') {
      setCurrentPage('recruiter');
    } else if (userData.role === 'INTERVIEWER') {
      setCurrentPage('interviewer');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  useEffect(() => {
    if (!user && !['home', 'login', 'register'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, currentPage]);

  const renderPage = () => {
    if (!user && (currentPage === 'home' || currentPage === 'login' || currentPage === 'register')) {
      if (currentPage === 'register') return <Register onRegister={handleLogin} onSwitch={() => setCurrentPage('login')} />;
      if (currentPage === 'login') return <Login onLogin={handleLogin} onSwitch={() => setCurrentPage('register')} />;
      return <Home user={user} />;
    }

    if (!user) {
      return null;
    }

    switch (currentPage) {
      case 'home': return <PageWrapper key="home"><Home user={user} /></PageWrapper>;
      case 'applications': return <PageWrapper key="apps"><MyApplications user={user} /></PageWrapper>;
      case 'recruiter': return <PageWrapper key="recruiter"><RecruiterDashboard user={user} /></PageWrapper>;
      case 'interviewer': return <PageWrapper key="interviewer"><InterviewerEvaluation user={user} /></PageWrapper>;
      default: return <PageWrapper key="default"><Home user={user} /></PageWrapper>;
    }
  };

  return (
    <>
      <SplashScreen isVisible={showSplash} onComplete={handleSplashComplete} />
      {!showSplash && (
        <Layout
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        >
          {renderPage()}
        </Layout>
      )}
    </>
  );
}

export default App;
