import React, {lazy, Suspense, useContext} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ThemeContext} from './context/ThemeContext'
import HeaderComponent from './components/weather/header/HeaderComponent'
import FooterComponent from './components/weather/footer/FooterComponent'
import LoaderComponent from './components/weather/loader/LoaderComponent'

const HomeContainer = lazy(() => import('./containers/home/HomeContainer'))

function App() {
    const {theme} = useContext(ThemeContext)

    return (
        <Router>
            <div className={` bg-${theme} tracking-wider border-box wrapper`}>
                <div>
                    <HeaderComponent/>
                </div>
                <div>
                    <Suspense
                        fallback={<LoaderComponent loaderText='Loading components'/>}>
                        <Switch>
                            <Route path='/' exact component={HomeContainer}></Route>
                        </Switch>
                    </Suspense>
                </div>
                <div>
                    <FooterComponent/>
                </div>
            </div>
        </Router>
    )
    // return (
    //     <Router>
    //         <Navbar>
    //             <NavItem icon={<PlusIcon/>} destinationPath="/dvb"/>
    //             <NavItem icon={<BellIcon/>} destinationPath="/quote"/>
    //             <NavItem icon={<MessengerIcon/>} destinationPath="/cron"/>
    //             <NavItem icon={<ArrowIcon/>} destinationPath="https://iamsainikhil.com/weather-react/"/>
    //         </Navbar>
    //
    //         <Switch>
    //             <Route exact path="/dvb/:stop?/:amount?/:offset?"
    //                    children={() => <DvbWidget name={"Malterstraße"}/>}/>
    //             <Route path="/quote" children={() => <Quote />}/>
    //             <Route path="/cron" children={() => <Guide />}/>
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
            <a href={props.destinationPath || "#"} className="icon-button">
                {props.icon}
            </a>
            {open && props.children}
        </li>
    );
}

export default App;
