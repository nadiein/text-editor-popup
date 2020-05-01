import React, { Component } from 'react';
import { Select } from './../select/Select';

const fontWeight:any[] = [100, 400, 500, 700];
const fontStyle:any[] = ['normal', 'italic'];

type MyProps = {
    model:PopupModel,
    optionChangedEvent:Function
};

export class Popup extends Component<MyProps> {
    public _value:any;

    get value():number { return this._value }
    set value(val:number) { this._value = val }

    constructor(props:any) {
        super(props);
    }

    componentDidMount = () => {
        this.value = this.props.model && this.props.model.fontProps.size
    }

    onSelectChange = (type:PopupFieldChangedType, event:any) => {
        if (type == PopupFieldChangedType.Color) {
            this.props.optionChangedEvent({type:type, option:event.target.value})
        } else {
            this.props.optionChangedEvent({type:type, option:event})
        }
    }

    onKeyDownEvent = (type:PopupFieldChangedType, e:any) => {
        if (e.keyCode == 13) {
            if (type == PopupFieldChangedType.Size) {
                this.props.optionChangedEvent({type:type, option:e.target.value})
            }
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
                        <input className="form-content" name="fontSize" type="text" onKeyDown={e => this.onKeyDownEvent(0, e)} />
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