import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Feed from './pages/Feed';
import ViewContent from './pages/ViewContent';
import AdminDashboard from './pages/AdminDashboard';
import Explore from './pages/Explore';
import Categories from './pages/Categories';
import About from './pages/About';
import Songs from './pages/Songs';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import { supabase } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import PageTransition from './components/PageTransition';

const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;
  }

  return session ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
              <Route path="/categories" element={<PageTransition><Categories /></PageTransition>} />
              <Route path="/stories" element={<PageTransition><Feed type="story" /></PageTransition>} />
              <Route path="/vlogs" element={<PageTransition><Feed type="vlog" /></PageTransition>} />
              <Route path="/poetry" element={<PageTransition><Feed type="poetry" /></PageTransition>} />
              <Route path="/songs" element={<PageTransition><Songs /></PageTransition>} />
              <Route path="/blog" element={<PageTransition><BlogList /></PageTransition>} />
              <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />
              <Route path="/view/:id" element={<PageTransition><ViewContent /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />

              <Route path="/admin" element={
                <PageTransition>
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                </PageTransition>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
