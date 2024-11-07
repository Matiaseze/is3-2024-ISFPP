import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const NavbarApp = () => {
    return (
        <Navbar bg="light" className="mb-3">
            <Container>
                <Navbar.Brand href="/">Home</Navbar.Brand>
                <Nav className="mx-auto">  {/* Centra el menú en la barra */}
                    <NavDropdown title="Productos" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/productos/registrar">Registrar nuevo Producto</NavDropdown.Item>
                        <NavDropdown.Item href="/productos">Catalogo</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="mx-auto">  {/* Centra el menú en la barra */}
                    <NavDropdown title="Categorias" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/categorias/registrar">Registrar nueva categoría</NavDropdown.Item>
                        <NavDropdown.Item href="/categorias">Listado de categorías</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarApp;