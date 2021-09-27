import React, {lazy, Suspense, useContext} from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {ThemeContext} from './context/ThemeContext'
import HeaderComponent from './components/weather/header/HeaderComponent'
import FooterComponent from './components/weather/footer/FooterComponent'
import LoaderComponent from './components/weather/loader/LoaderComponent'
import {DvbWidget} from "./components/Dvb/DvbComponent";
import Timer from "./components/Timer";
import Quote from "./components/Quote/QuoteComponent";
import TimerRest from "./components/TimerRest";

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
                            <Route exact path="/dvb/:stop?/:amount?/:offset?"
                                   children={() => <DvbWidget name={"Malterstraße"}/>}/>
                            <Route path="/quote" children={() => <Quote/>}/>
                            <Route path="/cron" children={() => <Timer/>}/>
                            <Route path="/rest" children={() => <TimerRest/>}/>
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
