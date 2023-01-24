import {BsFillTelephoneFill} from "react-icons/bs";
import {AiOutlineMail} from "react-icons/ai";
import {SiMinutemailer} from "react-icons/si";

export function Footer() {
    return (
        <footer>

            <section className="footer-details">

                <section>
                    <div>
                        <a href="tel: 0585118479"><BsFillTelephoneFill/> 0585118479</a>
                        <br/>
                    <AiOutlineMail/> winkelmann@gmail.com</div>
                </section>

                <section>
                    <p className="leave-message"><SiMinutemailer/> leave me a massage</p>
                </section>

            </section>

            &copy;all rights reserved
            <p>
                website made by David-Zim
            </p>
        </footer>
    );
}