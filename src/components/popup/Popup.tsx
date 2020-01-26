import React, { Component } from 'react';
import { Select } from './../select/Select';

const fontWeight:any[] = [100, 400, 500, 700];
const fontStyle:any[] = ['normal', 'italic'];

type MyProps = {
    isOpen:boolean,
    synonims:any,
    optionChangedEvent:Function
};

export class Popup extends Component<MyProps> {

    constructor(props:any) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    showTooltip = () => {
        this.setState({ visible: true });
    }

    hideTooltip = () => {
        this.setState({ visible: false });
    }

    onSelectChange = (option:string) => { this.props.optionChangedEvent(option) }

    render() {
        const { isOpen, synonims } = this.props;

        if (!isOpen) return null;
        return (
            <div className="popup-body">
                <label>
                    <span>Font size:</span>
                    <input name="fontSize" type="text" />
                </label>
                <label>
                    <span>Font weight:</span>
                    <Select optionChangedEvent={this.onSelectChange} items={fontWeight} />
                </label>
                <label>
                    <span>Font style:</span>
                    <Select optionChangedEvent={this.onSelectChange} items={fontStyle} />
                </label>
                <label>
                    <span>Font color:</span>
                    <input name="fontColor" type="color" />
                </label>
                <label>
                    <span>Font color:</span>
                    <Select optionChangedEvent={this.onSelectChange} items={synonims} />
                </label>
            </div>
        );
    }
}