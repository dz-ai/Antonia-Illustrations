import {mandala} from "../../imgs/imagesArray";
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from "react-responsive";
import {useEffect, useState} from "react";

export function HomePage() {
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery({query: '(max-width: 850px)'});
    const isHighScreen = useMediaQuery({query: '(min-height: 800px)'});

    const [imageDimensions, setImageDimensions] = useState<string>('150% auto');

    useEffect(() => {
        if (isHighScreen) {
            setImageDimensions('cover');
        } else if (isSmallScreen) {
            setImageDimensions('auto 130%');
        } else {
            setImageDimensions('150% auto');
        }
    }, [isSmallScreen, isHighScreen]);


    return (
        <>
            <div
                className="home-up-page"
            style={{
                background: `url(${mandala}) no-repeat center center`,
                backgroundSize: imageDimensions,
                flex: '1'
            }}
            >
                <div className="blur-home-img">
                    <h1>Antonia <br/> Illustrations</h1>

                    <nav className="home-down-page">
                    <button className="home-btn-r" onClick={() => navigate('/portfolio-shop/portfolio')}>Portfolio</button>
                    <button className="home-btn-l" onClick={() => navigate('/portfolio-shop/shop')}>Shop</button>
                </nav>
                </div>

            </div>
        </>
    );
}