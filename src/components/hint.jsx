import React, { useState } from "react";

const hint = () => {
    const [isHint, setHint] = useState(false);

    const handleHint = () => {
        setHint(!isHint);
    };

    return (
        <div>
            <button onClick={handleHint} id="hintButton"><i class="bi bi-map"></i></button>
            {isHint && (
                <>
                    <div class="map-container">
                        <img id="map" src=".\map.png" alt="map" />
                        <button id="closeHint" onClick={handleHint}><i class="bi bi-x-lg"></i></button>
                    </div>
                </>
            )} 
        </div>
    )
}

export default hint;