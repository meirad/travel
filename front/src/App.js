import React from 'react';
import Navbar from './layout/Navbar'; 
import Navbarstick from './layout/Navbarstick';
import Footer from './layout/Footer';
import AppRoutes from './Routes';
import { SearchProvider } from './context/SearchContext';



const App = () => {
  return (
      <div style={{ width: '100%' }}>
        < SearchProvider >
        <Navbarstick /> 
        <Navbar /> 
        <AppRoutes />  
        <Footer />  
        </SearchProvider >
      </div>
  );
};

export default App;
