import React, {useState} from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';

const Bots= () =>{
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () =>{
        setIsOpen(!isOpen);
    };

    return(
        <>
        <Sidebar isOpen={isOpen} toggle={toggle}/>
        <Navbar toggle={toggle}/>
        <p> This is the bots page</p>
        </>
    );
}

export default Bots;