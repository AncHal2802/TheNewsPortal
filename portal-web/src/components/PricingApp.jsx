import { useState } from "react";
import PricingCard from "./PricingCard";
import { BrowserRouter as Router } from "react-router-dom";

import "./PricingApp.css";

function PricingApp() {
    const [selectMonthly, setSelectMonthly] = useState(true);
    console.log(selectMonthly);
    return (
        <div className="PricingApp">
            <div className="app-container">
                {/* Header */}
                <header>
                    <h1 className="header-topic">Our Pricing Plan</h1>
                    <div className="header-row">
                        <p>Annually</p>
                        <label className="price-switch">
                            <input
                                className="price-checkbox"
                                onChange={() => {
                                    setSelectMonthly((prev) => !prev);
                                }}
                                type="checkbox"
                            />
                            <div className="switch-slider"></div>
                        </label>
                        <p>Monthly</p>
                    </div>
                </header>
                {/* Cards here */}
                <div className="pricing-cards">
                    <PricingCard
                        title="Monthly"
                        price={selectMonthly ? "₹20" : "₹50"}
                        articles="Read articles"
                        users="5"
                        commentSection="comments and polls"
                        externalLink="https://rzp.io/l/cZnIaMQqq"
                    />
                    <PricingCard
                        title="Annualy"
                        price={selectMonthly ? "₹34" : "₹100"}
                        articles="Read articles and participate"
                        users="10"
                        commentSection="comments , polls and blog posting"
                        externalLink="https://rzp.io/l/mOkz3PTmWE"
                    />

                </div>
            </div>
        </div>
    );
}

export default PricingApp;