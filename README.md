<a id="top"></a>
## React Skeleton (Hooks)

This demonstration shows how to perform the basic tasks needed to get a Toolkit application up and running with React. The app was created with `create-react-app`.  The code is documented throughout so this page just gives a brief overview. 

This demonstration uses Hooks. If you'd like to see the same demonstration using a component based approach, see [this demonstration](https://github.com/jsplumb-toolkit-demonstrations/react-skeleton).
 
<a name="imports"></a>
### Imports

```javascript
{
    "dependencies":{
        ...
        "jsplumbtoolkit": "file:./jsplumbtoolkit.tgz",
        "jsplumbtoolkit-react": "file:./jsplumbtoolkit-react.tgz",
        ...
    }
}
```

<a name="setup"></a>
### Setup/Initialization

The app consists of a `DemoComponent` which creates a Toolkit instance, and then renders a `JsPlumbToolkitSurfaceCompoment`. In this application we wrap our bootstrap in a `jsPlumbToolkit.ready(..)` function; we don't expect that real world apps will bootstrap themselves in this way.

This is the code for the `DemoComponent` class. We'll refer to this in the sections below.

```javascript
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { JsPlumbToolkitSurfaceComponent }  from 'jsplumbtoolkit-react';
import { jsPlumbToolkit } from 'jsplumbtoolkit';

import BoneComponent from "./bone-component.jsx";

const randomColor = () => {
let colors = ['#59bb59', '#c7a76c', '#8181b7', '#703a82', '#cc8080'];
return colors[Math.floor(Math.random() * colors.length)];
}

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


```

<a name="rendering"></a>
### Rendering

The Surface is rendered in the `render()` method of the demo component:


```javascript
render() {
    return <div style={{width:"100%",height:"100%",display:"flex"}}>
        <button onClick={() => changeColor()} style={{backgroundColor:currentColor}} className="colorButton">Change color</button>
        <JsPlumbToolkitSurfaceComponent childProps={{color:currentColor}} renderParams={renderParams} toolkit={toolkit} view={view} ref={surface} />
    </div>
}
```

It is provided with four attributes:

- `childProps` - a set of props to pass in to the context for any vertex components that are rendered.  See [this page](https://docs.jsplumbtoolkit.com/toolkit/current/articles/react-integration#passing-props) for information about this.
- `toolkit` - The instance of the Toolkit to use. We create it in the constructor of the demo component.
- `view` - Options for rendering nodes/groups/ports/edges. 
- `renderParams` - Options for the Surface component

We also render a button that can be used to change the component's "color"; we use that in this demonstration to show how to pass props to vertex components that have been rendered.

#### View

The view is where we configure the renderer for, and behaviour of, nodes, edges, groups and ports. In this demonstration we map a single node type, and we're using the `jsx` approach that is new in 2.3.0. The `type` member of each node's data is what we'll use to distinguish between node types in the UI.

```javascript
this.view = {
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
```

`BoneComponent` is a functional component, [discussed below](#bone-component)

We define how the "default" edge type will look - all edges implicitly have this type if one is not provided in the edge data. You can read more about edge types [here](https://docs.jsplumbtoolkit.com/toolkit/current/articles/data-model#node-edge-port-type).

Read more about views [here](https://docs.jsplumbtoolkit.com/toolkit/current/articles/views).
 
 #### Render Params
 
```javascript
 const renderParams = {
     layout:{
         type:"Spring"
     },
     zoomToFit:true,
     consumeRightClick:false
 };
```

We use a `Spring` layout, we allow right click on the canvas, and we zoom the canvas to fit on data load.


### Components

<a name="bone-component" ref="" title="BoneComponent"></a>

```javascript
import React, { useEffect } from 'react'

export default function BoneComponent({ color, ctx }) {

    const { vertex, surface, toolkit } = ctx;
    const data = vertex.data;

    const setLabel = (label) => {
        toolkit.updateNode(vertex, { label })
    };

    const hitMe = () => {
        setLabel("OUCH. My " + data.type);
        setTimeout(() => {
            setLabel(null);
        }, 2500)
    };

    // This `useEffect` will cause the node to be repainted if its label has changed. This will run after the label has
    // been changed and React has repainted what it needs to, so it's the right time to tell the renderer, since the new
    // size of the element is known.
    useEffect(() => {
        surface.repaint(vertex);
    }, [data.label]);

    return (
        <div style={{backgroundColor:color}}>
            <div style={{fontSize:"12px",textTransform:"uppercase"}}>{data.type} bone</div>
            <div style={{fontSize:"12px",textTransform:"uppercase"}}>{data.label}</div>
            <button onClick={() => hitMe()}>Hit.</button>
        </div>
    );
}

```


<a name="passing-props"></a>
### Passing Props to node components

Sometimes it can be useful to change the appearance of your nodes without manipulating the underlying data model. To do this you can arrange for props to be passed through to the components that the Surface renders. This is a two-stage process.  First, you have to pass the props you want to use in to the Surface's `childProps` prop:

```jsx harmony
<JsPlumbToolkitSurfaceComponent childProps={{color:currentColor}} .../>
```

`childProps` will be passed back as `props` inside the `ctx` object passed to your JSX generator function:

```
jsx: (ctx) => { return <BoneComponent color={ctx.props.color} ctx={ctx}/> }
```

Now, any call to `setColor` on `DemoComponent` will result in the `color` prop being updated for any `BoneComponent`, and the components re-rendering.





 
