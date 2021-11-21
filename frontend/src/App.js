import React, {lazy, Suspense, useContext} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ThemeContext} from './context/ThemeContext'
import HeaderComponent from './components/weather/header/HeaderComponent'
import FooterComponent from './components/weather/footer/FooterComponent'
import LoaderComponent from './components/weather/loader/LoaderComponent'
import {DvbWidget} from "./components/Dvb/DvbComponent";
import {PumpWidget} from "./components/PumpWidget";
import LogbookMain from "./components/logbook/LogbookMain";
import LogbookInformation from "./components/logbook/LogbookInformation";

const HomeContainer = lazy(() => import('./containers/home/HomeContainer'))
const Logbook = lazy(() => import('./components/logbook/Logbook'))
const LogbookOverview = lazy(() => import('./components/logbook/LogbookOverview'))
// const LogbookInformation = lazy(() => import('./components/logbook/LogbookInformation'))

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
                            <Route exact path="/dvb/:stop?/:amount?/:offset?"
                                   children={() => <DvbWidget name={"Malterstraße"}/>}/>
                            <Route exact path="/pump" children={() => <PumpWidget />} />
                            <Route exact path="/logbook" children={() => <LogbookMain />} />
                            <Route exact path="/logbook/new" component={Logbook} />
                            <Route exact path="/logbook/overview" component={LogbookOverview} />
                            <Route exact path="/logbook/information" children={() => <LogbookInformation />} />
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
