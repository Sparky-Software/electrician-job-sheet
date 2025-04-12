import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JobSheetPage from './pages/JobSheetPage';

function App() {
    return (
        <Router basename="/electrician">
            <div className="App">
                <Routes>
                    <Route path="/" element={<JobSheetPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
