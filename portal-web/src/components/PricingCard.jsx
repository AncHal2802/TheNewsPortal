import React from "react";
import "./PricingCard.css";
import { Link } from "react-router-dom";


const PricingCard = ({ title, price, articles, users, commentSection, externalLink }) => {
    // const handleReadMoreClick = () => {
    //     window.location.href = externalLink;
    // }
    return (
        
        <div className="PricingCard">
            <header>
                <p className="card-title">{title}</p>
                <h1 className="card-price">{price}</h1>
            </header>
       
            <div className="card-features">
                <div className="card-articles">{articles}</div>
                <div className="card-users-allowed">{users} users features</div>
                <div className="ca-comment-section">Interact through{commentSection}</div>
            </div>rd

            <Link to={externalLink}>
                <button className="card-btn">
                    READ MORE
                </button>
            </Link>
        </div>
    );
};

export default PricingCard;