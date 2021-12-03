import React from 'react';
import ChannelItem from "./ChannelItem";

export default function () {

    return (
      <div className={"flex flex-row flex-wrap gap-3 mx-2.5"}>
          <ChannelItem radioName={"Radio Dresden"} title={"GrChapterPrevious"}/>
          <ChannelItem radioName={"Energy Sachsen"} title={"asd"}/>
          <ChannelItem radioName={"HitRadio RTL"} title={"xasd"}/>
          <ChannelItem radioName={"MDR Jump"} title={"234234"}/>
      </div>
    );
}
