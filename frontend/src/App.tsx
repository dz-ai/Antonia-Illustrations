import './styles/app.scss'
import {Header} from "./layout/header/header";
import {Footer} from "./layout/footer/footer";
import {Content} from "./layout/content/content";

function App() {

  return (
    <div className="app">
        <Header />
        
        <div className="content-footer-wrapper">
            <Content/>
            <Footer/>
        </div>
        
    </div>
  )
}

export default App
