import {blueLPlant, meWithBook} from "../../imgs/imagesArray";
import {useNavigate} from "react-router-dom";


export function AboutMePage() {
    const navigate = useNavigate();

    return (
        <div
            className="about-me"
            style={{
                background: `url(${blueLPlant}) no-repeat center center`,
                backgroundSize: 'cover',
                flex: '1'
            }}
        >
            <div className="blur-about-img">


                <h2>About Me</h2>

                <div className="text-container">
                    <div>
                        <img src={meWithBook} alt=""/>
                    </div>

                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Ab aut distinctio exercitationem, in natus obcaecati totam voluptatem.
                        Aliquam aut eius labore non, quibusdam quidem totam voluptatem!
                        Esse incidunt obcaecati similique.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Ab aut distinctio exercitationem, in natus obcaecati totam voluptatem.
                        Aliquam aut eius labore non, quibusdam quidem totam voluptatem!
                        Esse incidunt obcaecati similique.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Ab aut distinctio exercitationem, in natus obcaecati totam voluptatem.
                        Aliquam aut eius labore non, quibusdam quidem totam voluptatem!
                        Esse incidunt obcaecati similique.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Ab aut distinctio exercitationem, in natus obcaecati totam voluptatem.
                        Aliquam aut eius labore non, quibusdam quidem totam voluptatem!
                        Esse incidunt obcaecati similique.
                        Esse incidunt obcaecati similique.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Ab aut distinctio exercitationem, in natus obcaecati totam voluptatem.
                    </p>
                </div>

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>


        </div>
    );
}