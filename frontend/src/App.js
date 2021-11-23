import React, {lazy, Suspense, useContext, useMemo, useState} from 'react';
import {BrowserRouter as Router, Route, Switch, useLocation} from 'react-router-dom';
import {ThemeContext} from './context/ThemeContext'
import HeaderComponent from './components/weather/header/HeaderComponent'
import FooterComponent from './components/weather/footer/FooterComponent'
import LoaderComponent from './components/weather/loader/LoaderComponent'
import {DvbWidget} from "./components/Dvb/DvbComponent";
import {PumpWidget} from "./components/PumpWidget";
import Logbook from "./components/logbook/Logbook";

const HomeContainer = lazy(() => import('./containers/home/HomeContainer'))

// const Logbook = lazy(() => import('./components/logbook/Logbook'))


function App() {
    const params = new URLSearchParams(window.location.search);
    const {theme} = useContext(ThemeContext)

    return (
        <Router>
            <div className={`bg-${theme} tracking-wider border-box wrapper`}>
                <div>
                    {!params.get("key") && <HeaderComponent/>}
                </div>
                <div>
                    <Suspense
                        fallback={<LoaderComponent loaderText='Loading components'/>}>
                        <Switch>
                            <Route path='/' exact component={HomeContainer}/>
                            <Route exact path="/dvb/:stop?/:amount?/:offset?"
                                   children={() => <DvbWidget name={"Malterstraße"}/>}/>
                            <Route exact path="/pump" children={() => <PumpWidget/>}/>
                            <Route exact path="/logbook" children={() => <Logbook/>}/>
                        </Switch>
                    </Suspense>
                </div>
                <div>
                    <FooterComponent/>
                </div>
            </div>
        </Router>
    )
}

export default App;
