import React from 'react';
import {Link} from 'react-router-dom';

const Index = () => {
    return (
        <html>
        <head>
            <title>Game Stats Central</title>
        </head>
        <body>
        <h1>Welcome to Game Stats Central</h1>
        <p>On this website, you will find statistics about all your favorite games. Choose from the options below to get started:</p>
        <ul>
            <li><Link to={'/lotto/index'}>Lotto</Link></li>
            <li><Link to={'/viking/index'}>Viking lotto</Link></li>
            <li><Link to={'/euro/index'}>Euro-jackpot</Link></li>
            <li><Link to={'/about'}>About</Link></li>
        </ul>
        </body>
        </html>
    );
};

export default Index;