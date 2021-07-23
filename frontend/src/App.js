import React, {useEffect, useRef, useState} from 'react';
import {CSSTransition} from 'react-transition-group';

import {ReactComponent as BellIcon} from './icons/bell.svg';
import {ReactComponent as MessengerIcon} from './icons/messenger.svg';
import {ReactComponent as CaretIcon} from './icons/caret.svg';
import {ReactComponent as PlusIcon} from './icons/plus.svg';
import {ReactComponent as CogIcon} from './icons/cog.svg';
import {ReactComponent as ChevronIcon} from './icons/chevron.svg';
import {ReactComponent as ArrowIcon} from './icons/arrow.svg';
import {ReactComponent as BoltIcon} from './icons/bolt.svg';
import {DvbWidget} from "./dvb/Dvb";
import Quote from "./qutoe/Quote";

function App() {
    return (
        // <table cellPadding="0" cellSpacing="0" className="main-table">
        //     <tbody>
        //     <tr>
        //         <td>
        //             <DvbWidget name="Malterstraße"/>
        //         </td>
        //         <td>
        //             <Navbar>
        //                 <NavItem icon={<PlusIcon/>}/>
        //                 <NavItem icon={<BellIcon/>}/>
        //                 <NavItem icon={<MessengerIcon/>}/>
        //                 <NavItem icon={<CaretIcon/>}>
        //                     <DropdownMenu/>
        //                 </NavItem>
        //             </Navbar>
        //         </td>
        //     </tr>
        //     <tr>
        //         <td>
                    <Quote />
        //         </td>
        //         <td>Test4</td>
        //     </tr>
        //     </tbody>
        // </table>
    );
}

function DropdownMenu() {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMenuHeight(dropdownRef.current.firstChild.offsetHeight)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    function DropdownItem(props) {
        return (
            <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}

                <span className="icon-right">{props.rightIcon}</span>
            </a>
        );
    }

    return (
        <div className="dropdown" style={{height: menuHeight}} ref={dropdownRef}>
            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem>My Profile</DropdownItem>
                    <DropdownItem
                        leftIcon={<CogIcon/>}
                        rightIcon={<ChevronIcon/>}
                        goToMenu="settings">
                        Settings
                    </DropdownItem>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'settings'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon={<ArrowIcon/>}>
                        <h2>My Profile</h2>
                    </DropdownItem>
                    <DropdownItem leftIcon={<BoltIcon/>}>HTML</DropdownItem>
                    <DropdownItem leftIcon={<BoltIcon/>}>CSS</DropdownItem>
                    <DropdownItem leftIcon={<BoltIcon/>}>JavaScript</DropdownItem>
                    <DropdownItem leftIcon={<BoltIcon/>}>Awesome!</DropdownItem>
                </div>
            </CSSTransition>
        </div>
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
    const [open, setOpen] = useState(false);
    const NavItemRef = useRef();

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = ((event) => {
        const domNode = NavItemRef.current;

        if (!domNode || !domNode.contains(event.target)) {
            setOpen(false);
        }
    });

    return (
        <li className="nav-item" ref={NavItemRef}>
            <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
                {props.icon}
            </a>
            {open && props.children}
        </li>
    );
}

export default App;
