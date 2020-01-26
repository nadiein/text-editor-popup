import React, { Component } from 'react';
import { ApiService, RequestParams } from '../../api/service';
import { EventDispatcher, EventType } from '../../utils/utils';
import { PopupPortal } from './../../portals/PopupPortal';
import { Select } from './../select/Select';

type MyProps = {};
type MyState = {
    model:any,
    synonims:any,
    isLoading:any,
    errorMessage:any,
};

export default class Text extends Component<MyProps, MyState> {
    public service:ApiService;
    public stateConfig:MyState;

    get selectedText():any { return window.getSelection ? window.getSelection().getRangeAt(0) : '' }

    constructor(service:ApiService) {
        super(null);
        this.service = new ApiService();
        this.state = {...this.stateConfig};
    }

    componentDidMount = () => {
        this.service.getData().subscribe(res => {
            this.setState({model: res, isLoading: false})
        })
    }

    getSynonimsForWord = (params:RequestParams) => {
        this.service.getSynonims(params).subscribe(res => {
            this.setState({synonims: res})
        })
    }

    dispatchEvent = (event: any,type:EventType) => {
        switch(type) {
            case EventType.MouseUp: {
                console.log(window.getSelection().toString())
                if (this.selectedText != '') {
                    let params:RequestParams = new RequestParams();
                    params.word = this.selectedText;
                    if (params.word !== '') {
                        this.getSynonimsForWord(params);
                    }
                }
                break;
            }
        }
    }


    onSelectChange = (option:string) => {
        if (this.selectedText != '') {
            this.selectedText.deleteContents();

            let newElement = document.createElement('span');
            newElement.textContent = option + ' ';
            let fragment = document.createDocumentFragment()
            let node = null;
            let lastNode = null;
            while ( (node = newElement.firstChild) ) {
                lastNode = fragment.appendChild(node);
            }
            this.selectedText.insertNode(fragment);
        }
    }

    // handle case with select component still exist when selection is empty

    render() {
        const {model, synonims, isLoading, errorMessage} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {model && model.text ? model.text.map((item:any, id:any) => (
                    <li
                        onDoubleClick={(e:any) => this.dispatchEvent(e, 0)}
                        onMouseDown={(e:any) => this.dispatchEvent(e, 1)}
                        onMouseUp={(e:any) => this.dispatchEvent(e, 2)}
                        key={id}>
                            {item}
                    </li>
                )) : errorMessage}
                <PopupPortal
                    isOpen={synonims && this.selectedText != ''}
                    synonims={synonims ? synonims.words : null}
                    optionChangedEvent={this.onSelectChange}
                    /*onRequestClose={() => this.setState({ isOpen: false })}*/>
                </PopupPortal>
            </div>
        )

    }
}
