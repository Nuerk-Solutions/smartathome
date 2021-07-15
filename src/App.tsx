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

function App() {
    return (
        <Navbar>
            <NavItem icon={<PlusIcon/>}/>
            <NavItem icon={<BellIcon/>}/>
            <NavItem icon={<MessengerIcon/>}/>

            <NavItem icon={<CaretIcon/>}>
                <DropdownMenu/>
            </NavItem>
        </Navbar>
    );
}

function DropdownMenu() {

    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null as any);
    const dropdownRef = useRef(null as any);

    useEffect(() => {
        setMenuHeight(dropdownRef.current.firstChild.offsetHeight)
    }, [])

    function calcHeight(el: any) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    function DropdownItem(props: any) {
        return (
            <a href="/#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
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

function Navbar(props: any) {
    return (
        <nav className="navbar">
            <ul className="navbar-nav"> {props.children}</ul>
        </nav>
    );
}

function NavItem(props: any) {
    const [open, setOpen] = useState(false);
    const NavItemRef = useRef() as any;

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = ((event: any) => {
        const domNode: any = NavItemRef.current;

        if (!domNode || !domNode.contains(event.target)) {
            setOpen(false);
        }
    });

    return (
        <li className="nav-item" ref={NavItemRef}>
            <a href="/#" className="icon-button" onClick={() => setOpen(!open)}>
                {props.icon}
            </a>
            {open && props.children}
        </li>
    );
}

export default App;
