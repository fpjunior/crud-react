import React from 'react';
import { Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import './DeleteButton.css';


function DeleteButton({ onClick }) {
  return (
    <Button className="btn-delete" variant="danger" onClick={onClick}>
   <BsTrash />
  </Button>
  );
}

export default DeleteButton;
