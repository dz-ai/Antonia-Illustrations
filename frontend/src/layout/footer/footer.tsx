import {BsFillTelephoneFill} from "react-icons/bs";
import {AiOutlineMail} from "react-icons/ai";
import {SiMinutemailer} from "react-icons/si";

export function Footer() {
    return (
        <footer>

            <section className="footer-details">

                <section>
                    <div>
                    <AiOutlineMail/> winkelmann@gmail.com</div>
                        <br/>
                        <a href="tel: 0585118479"><BsFillTelephoneFill/> 0585118479</a>
                </section>

                <section>
                    <button className="leave-message"><SiMinutemailer/> leave me a massage</button>
                </section>

            </section>

            &copy;all rights reserved
            <p>
                website made by David-Zim
            </p>
        </footer>
    );
}