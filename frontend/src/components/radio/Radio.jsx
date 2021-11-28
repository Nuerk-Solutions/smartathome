import React from 'react';
import ChannelItem from "./ChannelItem";

export default function () {

    return (
      <div className={"flex flex-row flex-wrap gap-3 mx-2.5"}>
          <ChannelItem name={"Radio Dresden"}/>
          <ChannelItem name={"Energy Sachsen"}/>
          <ChannelItem name={"HitRadio RTL"}/>
          <ChannelItem name={"MDR Jump"}/>
      </div>
    );
}
