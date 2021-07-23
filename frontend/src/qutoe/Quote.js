import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";

export default () => (
    <Carousel autoPlay={true} autoFocus={true} infiniteLoop={true} interval={10000} transitionTime={1000} showArrows={false} showThumbs={false} showStatus={false} swipeable={true} emulateTouch={true}>
        <CarouselItem
            image="https://theysaidso.com/img/qod/qod-love.jpg"
            caption="Test1"
        />
        <CarouselItem
            image="https://theysaidso.com/img/qod/qod-love.jpg"
            caption="Test1"
        />
        <CarouselItem
            image="https://theysaidso.com/img/qod/qod-love.jpg"
            caption="Test1"
        />
    </Carousel>
);

function CarouselItem(props) {
    return (
        <div>
            <img src={props.image} alt="Failed to load image"/>
            {props.caption && <p className={props.className ? `legend ${props.className }` : "legend"}>{props.caption}</p>}
        </div>
    );
}

