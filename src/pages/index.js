import React from 'react';
import {Link} from 'react-router-dom';

const Index = () => {
    return (
        <div>
            <h1>Welcome to GeeksforGeeks</h1>
            <Link to="/about">About</Link>
        </div>
    );
};

export default Index;