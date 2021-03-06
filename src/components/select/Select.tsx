import React, { Component } from 'react';

type MyProps = {
    items:any[],
    optionChangedEvent:Function
};

export class Select extends Component<MyProps> {

    onOptionChangedEvent = (event:any) => {
        this.props.optionChangedEvent(event.target.value)
    }

    render() {
        const { items } = this.props;
        return (
            <select className="form-content" onChange={(e:any) => this.onOptionChangedEvent(e)}>
                {items && items.map((item:any, id:any) => (
                    <option key={id} value={item}>{item}</option>
                ))}
            </select>
        )
    }
}
