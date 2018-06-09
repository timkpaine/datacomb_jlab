/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

import {Widget} from '@phosphor/widgets';
import {Message} from '@phosphor/messaging';
import {IRenderMime} from '@jupyterlab/rendermime-interfaces';

import '../style/index.css';
import '../style/datacomb.css';

import * as Datacomb from './datacomb';

export
const MIME_TYPE = 'application/datacomb+json';

export
const DATACOMB_CLASS = 'jp-DatacombViewer';

export
const DATACOMB_CONTAINER_CLASS = 'jp-DatacombContainer';

interface DatacombSpec {
    rows: string,
    columns: string
}


export class RenderedDatacomb extends Widget implements IRenderMime.IRenderer {

    constructor() {
        let node = document.createElement('div');
        node.className = DATACOMB_CLASS;
        node.classList.add('datacomb');
        super({node: node});
    }

    onAfterAttach(msg: Message) : void {
        const { rows, columns } = this._spec;
        this._dc = new Datacomb({
          el: this.node,
          data: JSON.parse(rows),
          columns: JSON.parse(columns),
          labelAccessor: 'name'
        });
        console.log(this._dc);

    }

    renderModel(model: IRenderMime.IMimeModel): Promise<void> {
        this._spec = model.data[MIME_TYPE] as any | DatacombSpec;
        return Promise.resolve();
    }

    private _spec: DatacombSpec;
    private _dc: object;
}


export const rendererFactory: IRenderMime.IRendererFactory = {
    safe: false,
    mimeTypes: [MIME_TYPE],
    createRenderer: options => new RenderedDatacomb()
};


const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [{
    id: 'datacomb:factory',
    rendererFactory,
    dataType: 'string',
    fileTypes: [{
        name: 'datacomb',
        fileFormat: 'base64',
        mimeTypes: [MIME_TYPE],
        extensions: ['datacomb']
    }],
    documentWidgetFactoryOptions: {
        name: 'datacomb',
        modelName: 'base64',
        primaryFileType: 'datacomb',
        fileTypes: ['datacomb'],
        defaultFor: ['datacomb']
    },
}];

export default extensions;
