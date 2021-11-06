import React, {lazy, Suspense, useContext} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ThemeContext} from './context/ThemeContext'
import HeaderComponent from './components/weather/header/HeaderComponent'
import FooterComponent from './components/weather/footer/FooterComponent'
import LoaderComponent from './components/weather/loader/LoaderComponent'
import {DvbWidget} from "./components/Dvb/DvbComponent";
import {PumpWidget} from "./components/PumpWidget";

const HomeContainer = lazy(() => import('./containers/home/HomeContainer'));

function App() {
    const {theme} = useContext(ThemeContext)
    return (
        <BrowserRouter>
            <div className={`bg-${theme} tracking-wider border-box wrapper`}>
                <div>
                    <HeaderComponent/>
                </div>
                <div>
                    <Suspense
                        fallback={<LoaderComponent loaderText='Loading components'/>}>
                        <Routes>
                            <Route index path='/' element={<HomeContainer/>}/>
                            <Route path="/dvb">
                                <Route index element={<DvbWidget name={"Malterstraße"}/>} />
                                <Route path=":stop" element={<DvbWidget/>} />
                                <Route path=":stop/:amount" element={<DvbWidget/>} />
                                <Route path=":stop/:amount/:offset" element={<DvbWidget/>} />
                            </Route>
                            <Route path="/pump" element={<PumpWidget/>}/>
                        </Routes>
                    </Suspense>
                </div>
                <div>
                    <FooterComponent/>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App;
