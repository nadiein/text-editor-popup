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
                <label className="form-holder form-holder-xs">
                    <input className="form-content" name="fontSize" type="text" />
                </label>
                <label className="form-holder form-holder-xs">
                    <Select optionChangedEvent={this.onSelectChange} items={fontWeight} />
                </label>
                <label className="form-holder form-holder-sm">
                    <Select optionChangedEvent={this.onSelectChange} items={fontStyle} />
                </label>
                <label className="form-holder form-holder-xs">
                    <input className="form-content" name="fontColor" type="color" />
                </label>
                <label className="form-holder form-holder-sm">
                    <Select optionChangedEvent={this.onSelectChange} items={synonims} />
                </label>
            </div>
        );
    }
}