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
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/stories" element={<Feed type="story" />} />
              <Route path="/vlogs" element={<Feed type="vlog" />} />
              <Route path="/poetry" element={<Feed type="poetry" />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/view/:id" element={<ViewContent />} />
              <Route path="/about" element={<About />} />

              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
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
