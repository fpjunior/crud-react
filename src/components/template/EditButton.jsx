import React from 'react';
import Button from 'react-bootstrap/Button';
import { BsPencilSquare } from 'react-icons/bs';
import './EditButton.css';
import { Link } from 'react-router-dom';

function EditButton({ onClick, id }) {
  
  return (
    <Link to={`/cadastro/${id}`}>
      <Button className="edit-button" onClick={onClick}>
        <BsPencilSquare />
      </Button>
    </Link>
  );
}

export default EditButton;
