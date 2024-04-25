import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, Button } from 'reactstrap';
import "../styles/Header.css";  // Ensure this path is correct based on your project structure

const Header = () => {
  const navigate = useNavigate();

  return (
    <Navbar dark color="dark" expand="md" className="mb-3">
      <NavbarBrand onClick={() => navigate('/')} style={{cursor: 'pointer', color: 'white'}}>
      <img src="/cleric.png" alt="Company Logo" style={{ height: '30px', marginRight: '10px' }} />
      <strong>Cleric</strong>
      </NavbarBrand>
      <Button onClick={() => navigate('/')} color="secondary">
        Home
      </Button>
    </Navbar>
  );
};

export default Header;
