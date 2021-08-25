import React from 'react';
import {ReactComponent as BellIcon} from './icons/bell.svg';
import {ReactComponent as MessengerIcon} from './icons/messenger.svg';
import {ReactComponent as PlusIcon} from './icons/plus.svg';
import {DvbWidget} from "./dvb/Dvb";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Quote from "./qutoe/Quote";

function App() {
    return (
        <Router>
            <Navbar>
                <NavItem icon={<PlusIcon/>} destinationPath="/dvb"/>
                <NavItem icon={<BellIcon/>} destinationPath="/quote"/>
                <NavItem icon={<MessengerIcon/>}/>
            </Navbar>

            <Switch>
                <Route exact path="/dvb/:stop?/:amount?/:offset?"
                       children={() => <DvbWidget name={"Malterstraße"}/>}/>
                <Route path="/quote" children={() => <Quote />}/>
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
            <Link to={props.destinationPath || "#"} className="icon-button">
                {props.icon}
            </Link>
            {open && props.children}
        </li>
    );
}

export default App;
