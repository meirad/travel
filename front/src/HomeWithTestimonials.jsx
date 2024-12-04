import React from 'react';
import HomePage from './Component/HomePage';
import ClientTestimonials from './Component/ClientTestimonials';
import Contact from './Component/Contact';  

const HomeWithTestimonials = () => {
    return (
        <div>
            <HomePage />
            <ClientTestimonials />
            <Contact />
        </div>
    );
};

export default HomeWithTestimonials;
