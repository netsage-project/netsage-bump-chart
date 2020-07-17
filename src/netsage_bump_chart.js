/*
 * (C) 2019 Mahesh Khanal,Katrina Turner
 * Laboratory for Advanced Visualization and Applications, University of Hawaii at Manoa.
 */

/*
Copyright 2018 The Trustees of Indiana University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import ParseData from './js/netsageBumpChart_parser';
import BumpChart from './js/netsageBumpChart_bumpchart';



import './css/netsageBumpChart_styles.css!';
//import d3 from './js/netsageBumpChart_d3.v3';

////// place global variables here ////
const panelDefaults = {
	num_top_talkers: 10,
	header1: "Source Organization"
};

export class NetsageBumpChart extends MetricsPanelCtrl {
	constructor($scope, $injector) {
		super($scope, $injector);

		_.defaults(this.panel, panelDefaults);
		this.netsageBumpChart_holder_id = 'netsageBumpChart_' + this.panel.id;
		this.containerDivId = 'container_' + this.netsageBumpChart_holder_id;

		this.events.on('data-received', this.onDataReceived.bind(this));
		this.events.on('data-error', this.onDataError.bind(this));
		this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));
		this.events.on('render', this.setup.bind(this));
		this.events.on('refresh', this.setup.bind(this));
	}

	onDataReceived(dataList) {
		this.process_data(dataList);
		this.render();
	}

	process_data(dataList) {
		this.parsedData = ParseData(dataList);
	}

	onDataError(err) { }

	onInitEditMode() {
		this.addEditorTab('Options', 'public/plugins/netsage-bump-chart/editor.html', 2);
		this.addEditorTab('Display', 'public/plugins/netsage-bump-chart/display_editor.html', 3);

		this.render();
	}

	onInitPanelActions(actions) {
		this.render();
	}

	link(scope, elem, attrs, ctrl) {
		if (!document.getElementById(ctrl.netsageBumpChart_holder_id)) {
			return;
		}
		this.render();
	}

	setup() {

		var ctrl = this;
		var offh = 450;
		if (document.getElementById(this.netsageBumpChart_holder_id)) {
			offh = document.getElementById(this.netsageBumpChart_holder_id).offsetHeight;
		}
		if (offh == 0) {
			return setTimeout(function () { ctrl.setup(); }, 250);
		}


		var container = document.getElementById(this.containerDivId);
		if (container) {
			container.innerHTML = "";
			let svgHandler = new BumpChart(this.containerDivId);
			if (this.parsedData) {
				svgHandler.renderChart(this.parsedData, ctrl, this.panel.header1, this.panel.num_top_talkers);
			}


		}
	}
}

NetsageBumpChart.templateUrl = 'module.html';
