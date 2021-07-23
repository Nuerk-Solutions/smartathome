import React, {useEffect, useState} from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";
import data from "./../assets/q_art.json";

//https://www.npmjs.com/package/react-responsive-carousel
export default () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [json, setJson] = useState([]);

    let controller = new AbortController();
    useEffect(() => {
        fetch('https://quotes.rest/qod/categories.json', {cache: "only-if-cached", mode: "same-origin", signal: controller.signal})
            // .catch(e => e instanceof TypeError && e.message === "Failed to fetch" ?
            //     ({status: 504}) : Promise.reject(e))
            .then(res => {
                console.log("1")
                if(res.status === 504) {
                    controller.abort()
                    controller = new AbortController();
                    console.log("2");
                    return fetch("https://quotes.rest/qod/categories.json",{cache: "force-cache", mode: "cors", signal: controller.signal})
                }
                const date = res.headers.get("date"), dt = date ? new Date(date).getTime() : 0;
                console.log("3");
                if(dt < (Date.now() - 86400000)) {
                    console.log("4");
                    //if older than 24 hours
                    controller.abort();
                    controller = new AbortController();
                    return fetch("https://quotes.rest/qod/categories.json",{cache: "reload", mode: "cors", signal: controller.signal})
                }
                console.log("5");
                // Other possible conditions
                if (dt < (Date.now() - 300000)) // If it's older than 5 minutes
                    fetch("some.json", {cache: "no-cache", mode: "same-origin"}) // no cancellation or return value.
                console.log("6");
                return res
            })
            .then(res => res.json())
            .then(
                (result) => {
                    setError(null);
                    setIsLoaded(true);
                    setJson(result);
                    console.dir(JSON.stringify(result));
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                a
            </div>
            // <Carousel autoPlay autoFocus infiniteLoop swipeable emulateTouch
            //           showArrows={false} showThumbs={false} showStatus={false}
            //           interval={10000} transitionTime={1000} width={"75%"}>
            //     {json.map(item => (
            //         <CarouselItem
            //             key="1"
            //             image={item.contents.quotes[0].background}
            //             caption={item.contents.quotes[0].quote}
            //         />
            //     ))}
            // </Carousel>
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

const cachedFetch = (url, options) => {
    let expiry = 5 * 60 // 5 min default
    if (typeof options === 'number') {
        expiry = options
        options = undefined
    } else if (typeof options === 'object') {
        // I hope you didn't set it to 0 seconds
        expiry = options.seconds || expiry
    }
    // Use the URL as the cache key to sessionStorage
    let cacheKey = url
    let cached = localStorage.getItem(cacheKey)
    let whenCached = localStorage.getItem(cacheKey + ':ts')
    if (cached !== null && whenCached !== null) {
        // it was in sessionStorage! Yay!
        // Even though 'whenCached' is a string, this operation
        // works because the minus sign converts the
        // string to an integer and it will work.
        let age = (Date.now() - whenCached) / 1000
        if (age < expiry) {
            let response = new Response(new Blob([cached]))
            return Promise.resolve(response)
        } else {
            // We need to clean up this old key
            localStorage.removeItem(cacheKey)
            localStorage.removeItem(cacheKey + ':ts')
        }
    }

    return fetch(url, options).then(response => {
        // let's only store in cache if the content-type is
        // JSON or something non-binary
        if (response.status === 200) {
            let ct = response.headers.get('Content-Type')
            if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
                // There is a .json() instead of .text() but
                // we're going to store it in sessionStorage as
                // string anyway.
                // If we don't clone the response, it will be
                // consumed by the time it's returned. This
                // way we're being un-intrusive.
                response.clone().text().then(content => {
                    localStorage.setItem(cacheKey, content)
                    localStorage.setItem(cacheKey+':ts', Date.now())
                })
            }
        }
        return response
    })
}

