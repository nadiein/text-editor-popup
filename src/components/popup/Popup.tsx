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

    onSelectChange = (type:PopupFieldChangedType, option:any) => {
        if (type == PopupFieldChangedType.Size || type == PopupFieldChangedType.Color) {
            this.props.optionChangedEvent({type:type, option:option.target.value})
        } else {
            this.props.optionChangedEvent({type:type, option:option})
        }
    }

    render() {
        const { model } = this.props;
        const isOpen = model && model.isOpen;
        let styles = {
            top:model && model.y,
            left:model && model.x
        }
        // TODO implement two-way databinding
        if (!isOpen) {
            return null;
        } else {
            return (
                <div style={styles} className="popup-body">
                    <label className="form-holder form-holder-xs">
                        <input onChange={(e:any) => this.onSelectChange(0, e)} className="form-content" name="fontSize" type="text" value={model.fontProps.size} />
                    </label>
                    <label className="form-holder form-holder-xs">
                        <Select optionChangedEvent={(e:any) => this.onSelectChange(1, e)} items={fontWeight} />
                    </label>
                    <label className="form-holder form-holder-sm">
                        <Select optionChangedEvent={(e:any) => this.onSelectChange(2, e)} items={fontStyle} />
                    </label>
                    <label className="form-holder form-holder-xs">
                        <input onChange={(e:any) => this.onSelectChange(3, e)} className="form-content" name="fontColor" type="color" />
                    </label>
                    <label className="form-holder form-holder-sm">
                        <Select optionChangedEvent={(e:any) => this.onSelectChange(4, e)} items={typeof model != 'undefined' && model.synonims} />
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
    fontProps:FontPropsVo = new FontPropsVo();
    synonims:Array<unknown>;
}

export enum PopupFieldChangedType {
    Size, Weight, Style, Color, Synonim
}

export class FontPropsVo {
    size:number;
    weight:number;
    style:string;
}