import React from "react";
import {GrChapterNext, GrChapterPrevious, IoPauseOutline, IoPlayOutline} from "react-icons/all";


const AudioControls = ({
                           isPlaying,
                           onPlayPauseClick,
                           // onPrevClick,
                           // onNextClick
                       }) => (
    <div className="audio-controls">
        {/*<button*/}
        {/*    type="button"*/}
        {/*    className="prev"*/}
        {/*    aria-label="Previous"*/}
        {/*    onClick={onPrevClick}*/}
        {/*>*/}
        {/*    <GrChapterPrevious size={50}/>*/}
        {/*</button>*/}
        {isPlaying ? (
            <button
                type="button"
                className="pause"
                onClick={() => onPlayPauseClick(false)}
                aria-label="Pause"
            >
                <IoPauseOutline size={50}/>
            </button>
        ) : (
            <button
                type="button"
                className="play"
                onClick={() => onPlayPauseClick(true)}
                aria-label="Play"
            >
                <IoPlayOutline size={50}/>
            </button>
        )}
        {/*<button*/}
        {/*    type="button"*/}
        {/*    className="next"*/}
        {/*    aria-label="Next"*/}
        {/*    onClick={onNextClick}*/}
        {/*>*/}
        {/*    <GrChapterNext size={50}/>*/}
        {/*</button>*/}
    </div>
);

export default AudioControls;

