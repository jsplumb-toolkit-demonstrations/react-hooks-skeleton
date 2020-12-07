import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { JsPlumbToolkitSurfaceComponent }  from 'jsplumbtoolkit-react';
import { jsPlumbToolkit } from 'jsplumbtoolkit';

import BoneComponent from "./bone-component.jsx";

const randomColor = () => {
    let colors = ['#59bb59', '#c7a76c', '#8181b7', '#703a82', '#cc8080'];
    return colors[Math.floor(Math.random() * colors.length)];
};

jsPlumbToolkit.ready(() => {

    function DemoComponent(props) {

        const surface = useRef(null);
        const toolkit = jsPlumbToolkit.newInstance();
        const [currentColor, setColor] = useState(randomColor());

        const view = {
            nodes: {
                "default":{
                    jsx: (ctx) => { return <BoneComponent color={ctx.props.color} ctx={ctx}/> }
                }
            },
            edges:{
                "default":{
                    connector:"Straight",
                    anchor:"Continuous",
                    overlays:[
                        [ "Label", { location:0.5, label:"${label}"}],
                        [ "Arrow", { location:1} ],
                        [ "Arrow", {location:0, direction:-1}]
                    ],
                    endpoint:"Blank"
                }
            }
        };

        const renderParams = {
            layout:{
                type:"Spring"
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
            toolkit.load({url:"data/data.json"});
        }, []);

        return <div style={{width:"100%",height:"100%",display:"flex"}}>
            <button onClick={() => changeColor()} style={{backgroundColor:currentColor}} className="colorButton">Change color</button>
            <JsPlumbToolkitSurfaceComponent childProps={{color:currentColor}} renderParams={renderParams} toolkit={toolkit} view={view} ref={surface} />
        </div>
    }

    ReactDOM.render(<DemoComponent/>, document.querySelector(".jtk-demo-canvas"));

});
