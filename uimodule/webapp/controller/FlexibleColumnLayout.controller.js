sap.ui.define([
	"sap/f/library",
	"sap/m/SplitContainer",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/core/Fragment",
	"../model/Revisioni",
	"./BaseController"
], function (fioriLibrary, SplitContainer, Controller, XMLView, Fragment, Revisioni, BaseController) {
	"use strict";

	var LayoutType = fioriLibrary.LayoutType;

	return BaseController.extend("flexcollay.controller.FlexibleColumnLayout", {
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
			debugger
			this._loadView({
				id: "midView",
				viewName: "flexcollay.view.Detail"
			}).then(function (detailView) {
				this.addFooter(detailView)
				this.oFlexibleColumnLayout.addMidColumnPage(detailView);
				this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsMidExpanded);
				// detailView.attachBeforeExit(function () {
				// 	//debugger

				// }, this);
			}.bind(this));
		},

		addFooter: async function (detailView) {
			//debugger
			let userSet = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")
			let page = detailView.getContent()[0]
			let nameFragment
			let stato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato/stato")
			switch (userSet) {
				case "Qualità":

					if (stato == 'Firmato') {
						nameFragment = 'flexcollay.view.Fragments.FooterResp'
					} else {
						nameFragment = 'flexcollay.view.Fragments.FooterQualit'
					}
					break;
				// case "Responsabile":
				// nameFragment = 'flexcollay.view.Fragments.FooterResp'
				// break;
				default:
					nameFragment = 'flexcollay.view.Fragments.FooterOther'
					break;
			}
			debugger
			let visible = await this.setVisibleFooter(userSet !== 'Qualità' ? '' : userSet)
			if (visible != false) {
				let footer = await Fragment.load({
					id: this.getView().getId(),
					name: nameFragment,
					controller: this
				})
				page.setFooter(footer)
			} else { page.setFooter(null) }
		},
		setVisibleFooter: async function (footerRole) {
			let value = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
			let user = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome")
			debugger
			return await Revisioni.setVisibilityByStateAndSignature({ id: value.id, user: JSON.stringify({ nome: user, footerRole: footerRole }), token: this._getToken() })
		},


		_loadView: function (options) {
			var mViews = this._mViews = this._mViews || Object.create(null);
			if (!mViews[options.id]) {
				mViews[options.id] = this.getOwnerComponent().runAsOwner(function () {
					return XMLView.create(options);
				});
			}
			return mViews[options.id];
		},

	});
});