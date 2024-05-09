sap.ui.define([
	"sap/f/library",
	"sap/m/SplitContainer",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/XMLView"
], function (fioriLibrary, SplitContainer, Controller, XMLView) {
	"use strict";

	var LayoutType = fioriLibrary.LayoutType;

	return Controller.extend("flexcollay.controller.FlexibleColumnLayout", {
		onInit: function () {
			this.bus = this.getOwnerComponent().getEventBus();
			this.bus.subscribe("flexible", "setListPage", this.setListPage, this);
			this.bus.subscribe("flexible", "setDetailPage", this.setDetailPage, this);

			this.oFlexibleColumnLayout = this.byId("fcl");
		},

		onExit: function () {
			this.bus.unsubscribe("flexible", "setListPage", this.setListPage, this);
			this.bus.unsubscribe("flexible", "setDetailPage", this.setDetailPage, this);
		},

		setListPage: function () {
			this.oFlexibleColumnLayout.setLayout(LayoutType.OneColumn);
		},

		// Lazy loader for the mid page - only on demand (when the user clicks)
		setDetailPage: function () {
			this._loadView({
				id: "midView",
				viewName: "flexcollay.view.Detail"
			}).then(function (detailView) {
				this.oFlexibleColumnLayout.addMidColumnPage(detailView);
				this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsMidExpanded);
			}.bind(this));
		},


		_loadView: function (options) {
			var mViews = this._mViews = this._mViews || Object.create(null);
			if (!mViews[options.id]) {
				mViews[options.id] = this.getOwnerComponent().runAsOwner(function () {
					return XMLView.create(options);
				});
			}
			return mViews[options.id];
		}
	});
});