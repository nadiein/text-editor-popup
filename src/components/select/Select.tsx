import React, { Component } from 'react';

type MyProps = {
    items:string[],
    optionChangedEvent:Function
};

export class Select extends Component<MyProps> {

    onOptionChangedEvent = (event:any) => {
        this.props.optionChangedEvent(event.target.value)
    }

    render() {
        const { items } = this.props;
        return (
            <select onClick={(e:any) => this.onOptionChangedEvent(e)}>
                {items.map((item:string, id:any) => (
                    <option key={id} value={item}>{item}</option>
                ))}
            </select>
        )
    }
}