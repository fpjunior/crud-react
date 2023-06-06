import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { SlWrench, SlCalender } from "react-icons/sl";
import './Navbar.css';


function MyNavbar({ onClick }) {
    return (
        <>
            <Navbar className='my-navbar' bg="light" variant="light" onClick={onClick}>
                <Container>
                    {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
                    <Nav className="me-auto">
                        <div className='nav-group'>
                            

                            <div className='nav-backup'>
                                <SlWrench />
                                <p className='label-navbar'>Backup</p>
                            </div>

                            <div className='nav-calendar'>
                                <SlCalender />
                                <p className='label-navbar'>Calendário</p>
                            </div>

                        </div>

                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default MyNavbar;