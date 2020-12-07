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
