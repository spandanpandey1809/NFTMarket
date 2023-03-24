import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import Home from './pages';
import Create from './pages/Create';
import Owned from './pages/Owned';
import Market from './pages/Market';

function App() {
return (
	<Router>
	<Navbar />
	<Routes>
		<Route exact path='/' element={<Home />} />
		<Route path='/Market' element={<Market/>} />
		<Route path='/Owned' element={<Owned/>} />
		<Route path='/Create' element={<Create/>} />
	</Routes>
	</Router>
);
}

export default App;
