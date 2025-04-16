// src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from '@components/Layout';
import Routes from '@routes/Routes';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes />
      </Layout>
    </Router>
  );
}