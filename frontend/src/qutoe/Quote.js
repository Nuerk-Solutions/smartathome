import React, {useEffect, useState} from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";

//https://www.npmjs.com/package/react-responsive-carousel
export default () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);

    useEffect(() => {
        // fetch('https://quotes.rest/qod/categories.json')
        // fetch('http://localhost:3000/q_day.json')
        //     .then(res => res.json())
        //     .then(result => {
        //             setError(null);
        //             setJson(result);
        //             setIsLoaded(true);
        //         },
        //         (error) => {
        //             setIsLoaded(true);
        //             setError(error);
        //         }
        //     )
        cachedFetch("http://localhost:3000/q_day.json")
            .then(res => res.json())
            .then(result => {
                    setError(null);
                    setJson(result);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <Carousel autoPlay autoFocus infiniteLoop swipeable emulateTouch
                          showArrows={false} showThumbs={false} showStatus={false}
                          interval={10000} transitionTime={1000} width={"75%"}>
                    {[json].map(item => (
                        <CarouselItem
                            key="1"
                            image={item.contents.quotes[0].background}
                            caption={item.contents.quotes[0].quote}
                        />
                    ))}
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

// const preFlightCategoriesFetch = () => {
//     return         fetch('https://quotes.rest/qod/categories.json')
//         .then(res => res.json())
//         .then(result => {
//                 setError(null);
//                 setIsLoaded(true);
//                 setJson(result);
//                 console.dir(JSON.stringify(result));
//             },
//             (error) => {
//                 setIsLoaded(true);
//                 setError(error);
//             }
//         )
// }, [])
// }

function wait(ms) {
    return new Promise((fulfill) => setTimeout(fulfill, ms));
}

function isEmpty(value){
    return (value == null || value.length === 0 || value.trim() === "" || value === "undefined");
}

const cachedFetch = (url) => {
    let expiry = 60 * 60 // 60 min default
    let cacheKey = url
    let cached = localStorage.getItem(cacheKey)
    let whenCached = localStorage.getItem(cacheKey + ':ts')
    if (cached !== null && whenCached !== null) {
        let age = (Date.now() - whenCached) / 1000
        console.log(localStorage.getItem(cacheKey));
        if (age < expiry && !isEmpty(localStorage.getItem(cacheKey))) {
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

