import React from 'react'
import './InfoBar.css'
import onlineIcon from '../icon/onlineIcon.png'
import closeIcon from '../icon/closeIcon.png'
function InfoBar({ room }) {
    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <img className="onlineIcon" src={onlineIcon} alt="online image" />
                <h3>{room}</h3>
            </div>
            <div className="rightInnerContainer">
                <a href='/'><img src={closeIcon} alt="close image" /></a>
            </div>
        </div>
    )
}

export default InfoBar
