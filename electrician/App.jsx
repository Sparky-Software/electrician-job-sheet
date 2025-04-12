import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobSheetPage from './pages/JobSheetPage';
import JobSheetsListPage from './pages/JobSheetsListPage';

const App = () => {
    return (
        <Router basename="/electrician/">
            <Routes>
                <Route path="/" element={<JobSheetPage />} />
                <Route path="/job-sheets/" element={<JobSheetsListPage />} />
            </Routes>
        </Router>
    );
};

export default App;
