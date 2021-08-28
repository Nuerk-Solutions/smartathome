import React from 'react';
import {ReactComponent as BellIcon} from './assets/icons/bell.svg';
import {ReactComponent as MessengerIcon} from './assets/icons/messenger.svg';
import {ReactComponent as PlusIcon} from './assets/icons/plus.svg';
import {ReactComponent as ArrowIcon} from './assets/icons/arrow.svg';
import {DvbWidget} from "./components/Dvb/DvbComponent";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Quote from "./components/Quote/QuoteComponent";
import Guide from "./components/CronJob/guide/Guide";

function App() {
    return (
        <Router>
            <Navbar>
                <NavItem icon={<PlusIcon/>} destinationPath="/dvb"/>
                <NavItem icon={<BellIcon/>} destinationPath="/quote"/>
                <NavItem icon={<MessengerIcon/>} destinationPath="/cron"/>
                <NavItem icon={<ArrowIcon/>} destinationPath="https://iamsainikhil.com/weather-react/"/>
            </Navbar>

            <Switch>
                <Route exact path="/dvb/:stop?/:amount?/:offset?"
                       children={() => <DvbWidget name={"Malterstraße"}/>}/>
                <Route path="/quote" children={() => <Quote />}/>
                <Route path="/cron" children={() => <Guide />}/>
                <DvbWidget name={"Malterstraße"}/>
            </Switch>
        </Router>
    );
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
