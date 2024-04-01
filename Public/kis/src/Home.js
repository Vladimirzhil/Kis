import React from "react";
import { Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import './App.css';

export const Home = () => (
    <div className="buttons-container">
        <Link to="/Specification">
            <Button variant="primary" className="custom-button">Спецификация</Button>
        </Link>
        <Link to="/Order">
            <Button variant="primary" className="custom-button">Заказ</Button>
        </Link>
        <Link to="/Stock">
            <Button variant="primary" className="custom-button">Склад</Button>
        </Link>
    </div>
);
