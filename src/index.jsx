import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { JsPlumbToolkitSurfaceComponent }  from '@jsplumbtoolkit/browser-ui-react'
import { StraightConnector, BlankEndpoint, LabelOverlay, ArrowOverlay } from '@jsplumbtoolkit/browser-ui'
import { newInstance } from "@jsplumbtoolkit/browser-ui-react"
import { ForceDirectedLayout } from "@jsplumbtoolkit/layout-force-directed"

import BoneComponent from "./bone-component.jsx"

const randomColor = () => {
    let colors = ['#59bb59', '#c7a76c', '#8181b7', '#703a82', '#cc8080']
    return colors[Math.floor(Math.random() * colors.length)]
};

function DemoComponent(props) {

    const surface = useRef(null);
    const toolkit = newInstance();
    const [currentColor, setColor] = useState(randomColor());

    const view = {
        nodes: {
            "default":{
                jsx: (ctx) => { return <BoneComponent color={ctx.props.color} ctx={ctx}/> }
            }
        },
        edges:{
            "default":{
                connector:StraightConnector.type,
                anchor:"Continuous",
                overlays:[
                    { type: LabelOverlay.type ,options: { location:0.5, label:"${label}"}},
                    { type: ArrowOverlay.type, options:{ location:1} },
                    { type: ArrowOverlay.type, options:{location:0, direction:-1}}
                ],
                endpoint:BlankEndpoint.type
            }
        }
    };

    const renderParams = {
        layout:{
            type:ForceDirectedLayout.type
        },
        zoomToFit:true,
        consumeRightClick:false
    };

    const changeColor = () => {
        let col;
        while (true) {
            col = randomColor();
            if (col !== currentColor) {
                break;
            }
        }
        setColor(col);
    };

    // load the dataset once the component has mounted.
    useEffect(() => {
        // NOTE here that the data is loaded over ajax, meaning asynchronous to this useEffect. Loading data directly inside the useEffect
        // can confuse React as it's in the middle of a render cycle.

        /*
        toolkit.load({url:"data/data.json"});
        //*/

        //*
         toolkit.load({
            data:{
                "nodes":[
                    { "id":"1", "type":"shin" },
                    { "id":"2", "type":"knee" }
                ],
                "edges":[
                    { "source":"1", "target":"2", "data":{"label":"isConnectedTo"}}
                ]
            }
        })
        //*/
    }, []);

    return <div style={{width:"100%",height:"100%",display:"flex"}}>
        <button onClick={() => changeColor()} style={{backgroundColor:currentColor}} className="colorButton">Change color</button>
        <JsPlumbToolkitSurfaceComponent childProps={{color:currentColor}} renderParams={renderParams} toolkit={toolkit} view={view} ref={surface} />
    </div>
}

const container = document.querySelector(".jtk-demo-canvas")
const root = createRoot(container)
root.render(<DemoComponent/>)

