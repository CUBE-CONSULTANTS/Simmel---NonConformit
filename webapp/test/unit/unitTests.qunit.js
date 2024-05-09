/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"flex_col_lay/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
