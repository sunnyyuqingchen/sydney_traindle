import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const hint = () => {
    const [isHint, setHint] = useState(false);

    const handleHint = () => {
        setHint(!isHint);
    };

    return (
        <>
            <button onClick={handleHint} id="hintButton"><i className="bi bi-map"></i></button>
            {isHint && (
                <>
                    <div className="map-container">
                        <TransformWrapper
                        initialScale={1} // Start at normal size
                        minScale={1}     // No zooming out
                        maxScale={5}     // Allow zoom up to 5x
                        >
                            {/* Image with Drag & Zoom */}
                            <TransformComponent>
                                <img id="map" src="./Maps/map-old.png" alt="map" />
                            </TransformComponent>
                        </TransformWrapper>
                        <button id="closeHint" onClick={handleHint}><i class="bi bi-x-lg"></i></button>
                    </div>
                </>
            )} 
        </>
    )
}

export default hint;