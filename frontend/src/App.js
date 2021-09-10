import React, {Fragment, lazy, Suspense, useContext} from 'react';
// import {ReactComponent as BellIcon} from './assets/icons/bell.svg';
// import {ReactComponent as MessengerIcon} from './assets/icons/messenger.svg';
// import {ReactComponent as PlusIcon} from './assets/icons/plus.svg';
// import {ReactComponent as ArrowIcon} from './assets/icons/arrow.svg';
// import {DvbWidget} from "./components/Dvb/DvbComponent";
// import Quote from "./components/Quote/QuoteComponent";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {ThemeContext} from './context/ThemeContext'
import HeaderComponent from './components/weather/header/HeaderComponent'
import FooterComponent from './components/weather/footer/FooterComponent'
import LoaderComponent from './components/weather/loader/LoaderComponent'
// import Timer from "./components/Timer";

const HomeContainer = lazy(() => import('./containers/home/HomeContainer'))

function App() {
    const {theme} = useContext(ThemeContext)

    return (
        <Router>
            <div className={`bg-${theme} tracking-wider border-box wrapper`}>
                <div>
                    <HeaderComponent/>
                </div>
                <div>
                    <Suspense
                        fallback={<LoaderComponent loaderText='Loading components'/>}>
                        <Switch>
                            <Route path='/' exact component={HomeContainer}/>
                        </Switch>
                    </Suspense>
                </div>
                <div>
                    <FooterComponent/>
                </div>
            </div>
        </Router>
    );
    // return (
    //     <Router>
    //         <Navbar>
    //             <NavItem icon={<PlusIcon/>} destinationPath="/dvb"/>
    //             <NavItem icon={<BellIcon/>} destinationPath="/quote"/>
    //             <NavItem icon={<MessengerIcon/>} destinationPath="/cron"/>
    //             <NavItem icon={<ArrowIcon/>} destinationPath="/weather"/>
    //         </Navbar>
    //
    //         <Switch>
    //             <Route exact path="/dvb/:stop?/:amount?/:offset?"
    //                    children={() => <DvbWidget name={"Malterstraße"}/>}/>
    //             <Route path="/quote" children={() => <Quote/>}/>
    //             <Route path="/cron" children={() => <Timer/>}/>
    //             <DvbWidget name={"Malterstraße"}/>
    //         </Switch>
    //     </Router>
    // );
}

function Navbar(props) {
    return (
        <nav className="navbar">
            <ul className="navbar-nav"> {props.children}</ul>
        </nav>
    );
}

function NavItem(props) {

    return (
        <li className="nav-item">
            <Link to={props.destinationPath || "#"} className="icon-button">
                {props.icon}
            </Link>
            {open && props.children}
        </li>
    );
}

export default App;
