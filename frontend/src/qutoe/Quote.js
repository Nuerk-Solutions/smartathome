import React, {useEffect, useState} from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";
import LoadingSpinner from "../assets/components/LoadingSpinner";

//https://www.npmjs.com/package/react-responsive-carousel
export default () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);
    const [categories, setCategories] = useState([]);
    const baseUrl = "https://quotes.rest/qod.json?category=";
    const [contentArray, setContentArray] = useState({quote: [], background: []})

    useEffect(() => {
        fetch('http://localhost:3000/categories.json')
            .then(res => res.json())
            .then(result => {
                    let array = [];
                    result.map(item => {
                        let cat = Object.keys(item.contents.categories);
                        for (let i = 0; i < cat.length; i++) {
                            array.push(cat[i]);
                        }
                    });
                    setError(null);
                    setCategories(array);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    useEffect(() => {
        if (isEmpty(categories)) return;
        for (const categoriesKey in categories) {
            cachedFetch("http://localhost:3000/q_" + categories[categoriesKey] + ".json")
                .then(res => res.json())
                .then(result => {
                        setError(null);
                        let array = {quote: contentArray.quote, background: contentArray.background};
                        if (!isEmpty(result.contents)) {
                            array.quote.push(result.contents.quotes[0].quote);
                            array.background.push(result.contents.quotes[0].background);
                        }
                        setContentArray(array);
                    },
                    (error) => {
                        setError(error);
                    }
                )
        }
        setIsLoaded(true);
    }, [categories]);

    if (error) {
        return (
            <StateVisualComponent
                title={"Fehler"}
                content={<h2>{error.message}</h2>}
            />
        );
    } else if (!isLoaded) {
        return (
            <StateVisualComponent
                title={name}
                content={<LoadingSpinner style="spinner-pos"/>}
            />
        );
    } else {
        return (
            <div>
                <Carousel autoPlay autoFocus infiniteLoop swipeable emulateTouch
                          showArrows={false} showThumbs={false} showStatus={false}
                          interval={10000} transitionTime={1000} width={"75%"}>


                    {
                        contentArray.quote.map((quote, index) => {
                            const background = contentArray.background[index];
                            return (
                                <CarouselItem
                                    key={Math.random()}
                                    image={background}
                                    caption={quote}
                                />)
                        })
                    }
                </Carousel>
            </div>
        );
    }
}

function CarouselItem(props) {
    return (
        <div>
            <img src={props.image} alt="Failed to load image"/>
            {props.caption &&
            <p className={props.className ? `legend1 ${props.className}` : "legend1"}>{props.caption}</p>}
        </div>
    );
}

function wait(ms) {
    return new Promise((fulfill) => setTimeout(fulfill, ms));
}

function isEmpty(value) {
    return (value == null || value.length === 0 || value === "undefined");
}

const cachedFetch = (url) => {
    let expiry = 60 * 60 // 60 min default
    let cacheKey = url
    let cached = localStorage.getItem(cacheKey)
    let whenCached = localStorage.getItem(cacheKey + ':ts')
    if (cached !== null && whenCached !== null) {
        let age = (Date.now() - whenCached) / 1000
        if (age < expiry && localStorage.getItem(cacheKey).trim() !== "") {
            let response = new Response(new Blob([cached]))
            return Promise.resolve(response)
        } else {
            localStorage.removeItem(cacheKey)
            localStorage.removeItem(cacheKey + ':ts')
        }
    }

    return fetch(url).then(response => {
        if (response.status === 200) {
            let ct = response.headers.get('Content-Type')
            if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
                response.clone().text().then(content => {
                    localStorage.setItem(cacheKey, content)
                    localStorage.setItem(cacheKey + ':ts', Date.now().toString())
                })
            }
        }
        return response
    })
}

function StateVisualComponent(props) {
    return (
        <div>
            <div className="monitor-div">
                <h1>{props.title}</h1>
                <div className="main-div dropShadow">
                    {props.content}
                </div>
            </div>
        </div>
    );
}
