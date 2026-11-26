
import React from "react";

const PizzaLoader = () => {
    return (
        <div style={styles.overlay}>
            <div className="food-loader">

                {/* Falling Fruits */}
                <div className="falling-food food-one">
                    <span className="apple" />
                </div>

                <div className="falling-food food-two">
                    <span className="orange" />
                </div>

                <div className="falling-food food-three">
                    <span className="strawberry" />
                </div>

                <div className="falling-food food-four">
                    <span className="grapes">
                        <i />
                        <i />
                        <i />
                        <i />
                    </span>
                </div>

                <div className="falling-food food-five">
                    <span className="carrot" />
                </div>

                <div className="falling-food food-six">
                    <span className="leaf" />
                </div>

                {/* Pizza Loader */}
                <div className="loader-container">
                    <div className="pizza-loader" />
                </div>

                {/* Loading Text */}
                <div className="loading-content">
                    <div className="loading-title">
                        Preparing Your Meal
                    </div>

                    <div className="loading-subtitle">
                        Fresh ingredients, just for you
                    </div>

                    <div className="loading-dots">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            </div>

            <style>{`
                .food-loader {
                    position: relative;
                    width: 280px;
                    height: 260px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                /* Pizza */
                .loader-container {
                    width: 110px;
                    height: 110px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.8);
                    box-shadow: 0 8px 30px rgba(150,90,30,0.10);
                    z-index: 2;
                }

                .pizza-loader {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 8px solid #d1914b;
                    box-sizing: border-box;

                    --c: no-repeat radial-gradient(
                        farthest-side, #d64123 94%, #0000
                    );

                    --b: no-repeat radial-gradient(
                        farthest-side, #000 94%, #0000
                    );

                    background:
                        var(--c) 11px 15px,
                        var(--b) 6px 15px,
                        var(--c) 35px 23px,
                        var(--b) 29px 15px,
                        var(--c) 11px 46px,
                        var(--b) 11px 34px,
                        var(--c) 36px 0px,
                        var(--b) 50px 31px,
                        var(--c) 47px 43px,
                        var(--b) 31px 48px,
                        #f6d353;

                    background-size: 15px 15px, 6px 6px;
                    animation: pizza-spin 3s infinite;
                }

                @keyframes pizza-spin {
                    0% { -webkit-mask: conic-gradient(#0000 0, #000 0); }
                    16.67% { -webkit-mask: conic-gradient(#0000 60deg, #000 0); }
                    33.33% { -webkit-mask: conic-gradient(#0000 120deg, #000 0); }
                    50% { -webkit-mask: conic-gradient(#0000 180deg, #000 0); }
                    66.67% { -webkit-mask: conic-gradient(#0000 240deg, #000 0); }
                    83.33% { -webkit-mask: conic-gradient(#0000 300deg, #000 0); }
                    100% { -webkit-mask: conic-gradient(#0000 360deg, #000 0); }
                }

                /* Falling food animation */
                .falling-food {
                    position: absolute;
                    top: -15px;
                    opacity: 0;
                    animation: food-fall 3.5s linear infinite;
                    z-index: 1;
                }

                .food-one { left: 25px; animation-delay: 0s; }
                .food-two { left: 90px; animation-delay: 1.2s; }
                .food-three { right: 35px; animation-delay: 0.6s; }
                .food-four { right: 100px; animation-delay: 1.8s; }
                .food-five { left: 145px; animation-delay: 2.4s; }
                .food-six { right: 15px; animation-delay: 2s; }

                @keyframes food-fall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                        opacity: 0;
                    }
                    15% { opacity: 1; }
                    80% { opacity: 1; }
                    100% {
                        transform: translateY(180px) rotate(180deg);
                        opacity: 0;
                    }
                }

                /* Apple */
                .apple {
                    display: block;
                    width: 19px;
                    height: 19px;
                    background: #e94e45;
                    border-radius: 45% 45% 50% 50%;
                    position: relative;
                }

                .apple::before {
                    content: "";
                    position: absolute;
                    width: 5px;
                    height: 8px;
                    background: #478d4c;
                    border-radius: 100% 0;
                    top: -5px;
                    right: 1px;
                }

                /* Orange */
                .orange {
                    display: block;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #f6a33c;
                    border: 2px solid #e88c2a;
                }

                /* Strawberry */
                .strawberry {
                    display: block;
                    width: 18px;
                    height: 21px;
                    background: #e74b54;
                    border-radius: 45% 45% 55% 55%;
                    clip-path: polygon(0 0, 100% 0, 50% 100%);
                    position: relative;
                }

                /* Grapes */
                .grapes {
                    width: 23px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .grapes i {
                    width: 9px;
                    height: 9px;
                    background: #8054a7;
                    border-radius: 50%;
                    margin: 1px;
                }

                /* Carrot */
                .carrot {
                    display: block;
                    width: 13px;
                    height: 27px;
                    background: #f49a3f;
                    clip-path: polygon(0 0, 100% 0, 50% 100%);
                    transform: rotate(35deg);
                }

                /* Leaf */
                .leaf {
                    display: block;
                    width: 22px;
                    height: 13px;
                    background: #58a96c;
                    border-radius: 100% 0 100% 0;
                    transform: rotate(-30deg);
                }

                /* Loading text */
                .loading-content {
                    text-align: center;
                    margin-top: 25px;
                    animation: text-appear 0.8s ease both;
                }

                .loading-title {
                    font-size: 17px;
                    font-weight: 800;
                    color: #49314e;
                    letter-spacing: 0.3px;
                }

                .loading-subtitle {
                    font-size: 11px;
                    color: #938699;
                    margin-top: 6px;
                }

                .loading-dots {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    margin-top: 13px;
                }

                .loading-dots span {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #9b1ea9;
                    animation: dot-bounce 0.9s infinite alternate;
                }

                .loading-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .loading-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes dot-bounce {
                    from { transform: translateY(0); opacity: 0.4; }
                    to { transform: translateY(-6px); opacity: 1; }
                }

                @keyframes text-appear {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .food-loader *,
                    .food-loader *::before {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                    }
                }
            `}</style>
        </div>
    );
};

const styles = {
    overlay: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        background: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
    },
};

export default PizzaLoader;
