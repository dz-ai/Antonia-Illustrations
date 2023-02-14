import {mandala} from "../../imgs/imagesArray";
import {useNavigate} from 'react-router-dom';

export function HomePage() {
    const navigate = useNavigate();

    return (
        <>
            <div
                className="home-up-page"
            style={{
                background: `url(${mandala}) no-repeat center center`,
                backgroundSize: '150% auto',
                flex: '1'
            }}
            >
                <div className="blur-home-img">
                    <h1>Antonia <br/> Illustrations</h1>

                    <nav className="home-down-page">
                    <button className="home-btn-r" onClick={() => navigate('/portfolio-shop-Page/portfolio')}>Portfolio</button>
                    <button className="home-btn-l" onClick={() => navigate('/portfolio-shop-Page/shop')}>Shop</button>
                </nav>
                </div>

            </div>
        </>
    );
}