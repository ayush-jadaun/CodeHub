/**
 * @fileoverview Renders the welcome section of the landing page.
 * It includes animations for the title using GSAP.
 */
import React from 'react'
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import CodeHubLarge from "../Assets/Logos/CodeHubLarge.png"
import CCLogo from "../Assets/Logos/cclogo.png"
import Notification from '../Notification/Notification';
import "./Welcome.css"

gsap.registerPlugin(useGSAP);

export default function Welcome() {

    const introContainer = useRef();

    useGSAP(() => {
            gsap.from('#introTitle', {
                y: 200,
                opacity: 0,
                duration: 2,
                ease: "power3.out",
            });
            gsap.to( "#introTitle",{
                y: 25,
                duration: 4,
                ease: "power1.inOut",
                delay: 2,
                repeat: -1,
                yoyo: true

            });
        },
        { scope: introContainer }
    ); 

    return (
        <div id="welcomeMain" ref={introContainer}>

            <div id='welcomeBoxMain'>
                <div id='welcomePhotoGreetMain'>
                    <div id="notificationContainer" className="w-full pt-16 ">
                                        {/* <Notification /> */}
                    </div>
                    <img src={CCLogo} alt='CCLogo' />
                    <p>presents</p>
                    {/* CodeHubLarge image with animation */}
                    <img src={CodeHubLarge} alt="Code Hub" id='introTitle'/>
                </div>
            </div>
        </div>
    )
}