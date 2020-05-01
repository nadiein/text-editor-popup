import React, { Component } from 'react';
import { ApiService, RequestParams, TextModel, SynonymsModel, TextConfig } from '../../api/service';
import { EventType } from '../../utils/utils';
import { PopupPortal } from './../../portals/PopupPortal';
import { PopupModel, PopupFieldChangedType, FontPropsVo } from '../popup/Popup';
import { Subscription } from 'rxjs';

type MyProps = {};
type MyState = {
    data:TextModel,
    popup:PopupModel,
    range:any,
    isLoading:boolean,
    errorMessage:any,
};

export default class Text extends Component<MyProps, MyState> {
    private subscriptions:Subscription[] = [];
    private service:ApiService;
    private stateConfig:MyState;
    protected popupModel:PopupModel;
    private ref:any;

    get selectedText():any { return window.getSelection() }
    get selectedBoundingClientRect():DOMRect { return this.selectedText ? this.selectedText.getRangeAt(0).getBoundingClientRect() : null }

    constructor(service:ApiService) {
        super(service);
        this.service = new ApiService();
        this.state = {...this.stateConfig};
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);

        this.subscriptions.push(this.service.getData().subscribe(res => {
            this.setState({data: res, isLoading: false})
        }))
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        while (this.subscriptions.length > 0) {
            this.subscriptions.shift().unsubscribe();
        }
    }

    getSynonimsForWord = (params:RequestParams) => {
        this.service.getSynonims(params).subscribe((res:SynonymsModel) => {
            this.popupModel.synonims = res.words;
            this.setState({ popup: this.popupModel})
        })
    }

    dispatchEvent = (event:any, type:EventType) => {
        const TOP_GAP = 15;
        switch(type) {
            case EventType.MouseUp: {
                if (this.selectedText.toString() != '') {
                    let params:RequestParams = new RequestParams();
                    let textModel = new TextModel();
                    params.word = this.selectedText;

                    const size = window.getComputedStyle(this.selectedText.anchorNode.parentElement, null).getPropertyValue('font-size');
                    const weight = window.getComputedStyle(this.selectedText.anchorNode.parentElement, null).getPropertyValue('font-weight');
                    const style = window.getComputedStyle(this.selectedText.anchorNode.parentElement, null).getPropertyValue('font-style');

                    let fontProps = new FontPropsVo();
                    fontProps.size = parseInt(size);
                    fontProps.weight = Number(weight);
                    fontProps.style = style;

                    if (this.selectedBoundingClientRect) {
                        this.popupModel = new PopupModel();
                        this.popupModel.x = this.selectedBoundingClientRect.x;
                        this.popupModel.y = this.selectedBoundingClientRect.y - (this.selectedBoundingClientRect.height + TOP_GAP);
                        this.popupModel.isOpen = true;
                        this.popupModel.fontProps = fontProps;
                        this.setState({ popup: this.popupModel, range: this.saveSelection() })
                    }
                    this.getSynonimsForWord(params);
                }
                break;
            }
            case EventType.MouseDown: {
                break;
            }
        }
    }

    onSelectChange = (popupChanged:{type:PopupFieldChangedType, option:string}) => {
        const {data, popup} = this.state;
        if (this.selectedText || popup.synonims.length > 0) {
            // this.initAndUpdateTextConfig(popupChanged);
            // model.textConfig = this.initAndUpdateTextConfig(popupChanged);
            // this.setState({model:model})

            if (popupChanged.type == PopupFieldChangedType.Size) this.applyChangesToSelection(popupChanged.type, popupChanged.option);
            if (popupChanged.type == PopupFieldChangedType.Weight) this.applyChangesToSelection(popupChanged.type, popupChanged.option);
            if (popupChanged.type == PopupFieldChangedType.Style) this.applyChangesToSelection(popupChanged.type, popupChanged.option);
            if (popupChanged.type == PopupFieldChangedType.Color) this.applyChangesToSelection(popupChanged.type, popupChanged.option);
            if (popupChanged.type == PopupFieldChangedType.Synonim) this.applyChangesToSelection(popupChanged.type, popupChanged.option);
        }
    }

    applyChangesToSelection(type:PopupFieldChangedType, value:any) {
        const {data, range} = this.state;

        let newElement = document.createElement('span');
        let fragment = document.createDocumentFragment();

        if (type == PopupFieldChangedType.Size) {
            newElement.innerText = range.toString();
            newElement.style.fontSize = value + 'px';
        } else if (type == PopupFieldChangedType.Synonim) {
            newElement.textContent = value;
        } else if (type == PopupFieldChangedType.Weight) {

        } else if (type == PopupFieldChangedType.Style) {

        } else if (type == PopupFieldChangedType.Color) {

        }

        while ( newElement.firstChild ) {
            fragment.appendChild(newElement.firstChild);
        }

        this.restoreSelection(range)
        this.selectedText.getRangeAt(0).deleteContents();
        this.selectedText.getRangeAt(0).insertNode(fragment);
    }

    initAndUpdateTextConfig(popupChanged:{type:PopupFieldChangedType, option:string}):TextConfig {
        let config:TextConfig = new TextConfig();
        config.size = popupChanged.type == PopupFieldChangedType.Size ? popupChanged.option : '';
        config.weight = popupChanged.type == PopupFieldChangedType.Weight ? popupChanged.option : '';
        config.style = popupChanged.type == PopupFieldChangedType.Style ? popupChanged.option : '';
        config.color = popupChanged.type == PopupFieldChangedType.Color ? popupChanged.option : '';
        config.synonim = popupChanged.type == PopupFieldChangedType.Synonim ? popupChanged.option : '';
        return config;
    }

    setWrapperRef = (node:any) => { this.ref = node }

    handleClickOutside = (event:any) => {
        if (!event.target.offsetParent || event.target.offsetParent.className != 'popup-body') {
            if (this.popupModel) {
                this.popupModel.isOpen = false;
                this.setState({popup:this.popupModel});
            }
        }
    }

    saveSelection = () => {
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        }
        return null;
    }
    
    restoreSelection = (range:any) => {
        if (range) {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }

    // handle case with select component still exist when selection is empty

    render() {
        const {data, popup, isLoading, errorMessage} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <h1>Dummy text to demonstrate popup functionality.</h1>
                <div>
                    {data && data.text ? data.text.map((item:any, id:any) => (
                        <p
                            ref={(e:any) => this.setWrapperRef(e)}
                            onDoubleClick={(e:any) => this.dispatchEvent(e, 0)}
                            onMouseDown={(e:any) => this.dispatchEvent(e, 1)}
                            onMouseUp={(e:any) => this.dispatchEvent(e, 2)}
                            key={id}>
                                {item}
                        </p>
                    )) : errorMessage}
                    <PopupPortal
                        model={popup}
                        optionChangedEvent={this.onSelectChange}
                        /*onRequestClose={() => this.setState({ isOpen: false })}*/>
                    </PopupPortal>
                </div>
            </div>
        )

    }
}
