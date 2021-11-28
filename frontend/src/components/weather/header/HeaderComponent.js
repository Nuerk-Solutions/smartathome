import React, {useContext} from 'react'
import Toggle from 'react-toggle'
import './ReactToggle.scss'
import {ThemeContext} from '../../../context/ThemeContext'
import IconComponent from '../icon/IconComponent'
import {isEmpty} from 'lodash-es'
import {Link} from "react-router-dom";
import {GiBusStop, GiOilPump, MdOutlineRadio, RiBookLine, TiWeatherCloudy} from "react-icons/all";

export default () => {
    const {theme, toggleTheme} = useContext(ThemeContext)

    return (
        // <div className='flex justify-end items-center px-10 py-5'>
        <Navbar>
            <NavItem icon={<TiWeatherCloudy/>} destinationPath="/"/>
            <NavItem icon={<GiBusStop/>} destinationPath="/dvb"/>
            <NavItem icon={<GiOilPump/>} destinationPath="/pump"/>
            <NavItem icon={<MdOutlineRadio/>} destinationPath="/radio"/>
            <NavItem icon={<RiBookLine/>} destinationPath="/logbook"/>
            <CustomNavItem>
                {/*<div>*/}
                {/* below condition to avoid toggle glitch effect on page refresh */}
                {!isEmpty(theme) ? (
                    <Toggle
                        checked={theme === 'light'}
                        icons={{
                            checked: <IconComponent iconType={'light'}/>,
                            unchecked: <IconComponent iconType={'dark'}/>,
                        }}
                        onChange={toggleTheme}
                    />
                ) : null}
                {/*</div>*/}
            </CustomNavItem>
        </Navbar>

        // </div>
    )
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

function CustomNavItem(props) {

    return (
        <li className="nav-item">
            {open && props.children}
        </li>
    );
}
