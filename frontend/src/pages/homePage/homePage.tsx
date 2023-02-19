import {mandala} from "../../imgs/imagesArray";
import {useNavigate} from 'react-router-dom';
import {useMediaQuery} from "react-responsive";

export function HomePage() {
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery({query: '(max-width: 700px)'});

    return (
        <>
            <div
                className="home-up-page"
            style={{
                background: `url(${mandala}) no-repeat center center`,
                backgroundSize: isSmallScreen ? 'cover' : '150% auto',
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