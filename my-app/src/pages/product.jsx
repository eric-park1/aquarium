import React, { useState, useEffect } from 'react';
import './popup.css';

async function getUserCurrency() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const email = JSON.parse(storedUser).email;
        try {
            const response = await fetch(`/api/user/email/${email}`);
            if (!response.ok) {
                console.error(`Failed to fetch user data for ${email}`);
                return 0; // Fallback to 0 currency if the API call fails
            }
            const data = await response.json();
            console.log('Fetched user currency:', data.currency);
            return data.currency || 0; // Return 0 if currency is not found
        } catch (error) {
            console.error("Error fetching user currency:", error);
            return 0; // Return 0 currency if there is an error
        }
    }
    return 0; 
}


const updateUserCurrency = async (balance, id, productName) => {
    let email = null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        email = parsedUser.email;

        try {
            const response = await fetch('/api/userActions/updateCurrency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, currency: balance }),
            });

            const textResponse = await response.text();
            if (!response.ok) {
                console.error('Error updating currency:', textResponse);
                throw new Error('Failed to update user currency');
            }

            let result;
            try {
                result = JSON.parse(textResponse);
            } catch (e) {
                console.error('Error parsing response as JSON:', e);
                return false;
            }
            console.log(result.message); 

            // Proceed to add species
            const speciesAdd = await fetch('/api/userActions/addSpecies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, species: productName }),
            });

            if (!speciesAdd.ok) {
                const errorSpeciesAdd = await speciesAdd.json();
                console.error('Error adding species:', errorSpeciesAdd);
                throw new Error('Failed to update species');
            }

            const speciesAddResult = await speciesAdd.json();
            console.log(speciesAddResult.message);

            return true; // success
        } catch (error) {
            console.error('Error updating currency:', error);
            return false; // failure
        }
    }
};

const Product = (props) => {
    const { id, productName, price, productImage } = props.data;
    const [userCoins, setUserCoins] = useState(null); // Start with null to indicate loading
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(""); 

    // Fetch user coins on mount
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const coins = await getUserCurrency();
                console.log("Fetched user coins:", coins);
                setUserCoins(coins);
            } catch (error) {
                console.error("Error fetching user currency", error);
                setUserCoins(0); // Fallback in case of an error
            }
        };
        fetchCoins();
    }, []);

    // Handle Buy Button Click
    const handleBuyClick = () => {
        if (userCoins >= price) {
            setPopupType("confirm"); // Show sufficient funds popup
        } else {
            setPopupType("error"); // Show insufficient funds popup
        }
        setShowPopup(true);
    };

    // Handle Confirmation
    const handleConfirmBuy = async () => {
        const storedUser = localStorage.getItem("user");
        const email = storedUser ? JSON.parse(storedUser).email : null;

        const updatedCurrency = userCoins - price;
        const isSuccess = await updateUserCurrency(updatedCurrency, id, productName);

        if (isSuccess) {
            // Fetch updated currency and set it after purchase
            const newCurrency = await getUserCurrency();
            console.log("Updated user coins after purchase:", newCurrency);
            setUserCoins(newCurrency); // Update frontend state with new currency
            alert(`You successfully bought ${productName}!`);
        } else {
            alert('Failed to update your coins. Please try again.');
        }

        setShowPopup(false); // Close the popup
    };

    // Handle Cancel
    const handleCancel = () => {
        setShowPopup(false); // Close the popup
    };

    if (userCoins === null) {
        return <p>Loading your coin balance...</p>; // Loading state
    }

    return (
        <div className="product">
            <img src={productImage} alt={productName} />
            <div className="description">
                <p><b>{productName}</b></p>
                <p>Price: {price} coins</p>
                <p>Your Coins: {userCoins}</p>
            </div>
            <button className="buyFish" onClick={handleBuyClick} disabled={userCoins === null}>Buy</button>

            {/* Confirmation Popup */}
            {showPopup && popupType === "confirm" && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Are you sure you want to buy {productName} for {price} coins?</p>
                        <button onClick={handleConfirmBuy}>Yes</button>
                        <button onClick={handleCancel}>No</button>
                    </div>
                </div>
            )}

            {/* Insufficient Funds Popup */}
            {showPopup && popupType === "error" && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Sorry, you don't have enough coins to buy {productName}.</p>
                        <button onClick={handleCancel}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;