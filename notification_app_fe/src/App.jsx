import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NotificationsList from './pages/NotificationsList';
import CreateNotificationForm from './pages/CreateNotificationForm';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notifications" element={<NotificationsList />} />
        <Route path="/create" element={<CreateNotificationForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
