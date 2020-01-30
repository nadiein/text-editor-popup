import React, { Component } from 'react';
import { Select } from './../select/Select';

const fontWeight:any[] = [100, 400, 500, 700];
const fontStyle:any[] = ['normal', 'italic'];

type MyProps = {
    model:PopupModel,
    optionChangedEvent:Function
};

export class Popup extends Component<MyProps> {

    constructor(props:any) {
        super(props);
    }

    onSelectChange = (option:string) => { this.props.optionChangedEvent(option) }

    render() {
        const { model } = this.props;
        const isOpen = model && model.isOpen;
        let styles = {
            top:model && model.y,
            left:model && model.x
        }

        if (!isOpen) {
            return null;
        } else {
            return (
                <div style={styles} className="popup-body">
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
                        <Select optionChangedEvent={this.onSelectChange} items={typeof model != 'undefined' && model.synonims} />
                    </label>
                </div>
            );
        }
    }
}

export class PopupModel {
    x:number;
    y:number;
    isOpen:boolean = false;
    synonims:Array<unknown>;
}