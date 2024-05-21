sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast', "./BaseController",
    "sap/ui/core/Fragment", "../model/Revisioni"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, BaseController, Fragment, Revisioni) {
        "use strict";

        return BaseController.extend("flexcollay.controller.FlexibleColumnLayout", {
            onInit: function () {
                this.bus = this.getOwnerComponent().getEventBus();

                this.initialModel()
                this.addFooter()
            },
            addFooter: async function () {
                debugger
                let userSet = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")
                let page = this.getView().byId("ObjectPageLayout")
                let nameFragment
                switch (userSet) {
                    case "Qualità":
                        nameFragment = 'flexcollay.view.Fragments.FooterQualit'
                        break;
                    case "Responsabile":
                        nameFragment = 'flexcollay.view.Fragments.FooterResp'
                        break;
                    default:
                        nameFragment = 'flexcollay.view.Fragments.FooterOther'
                        break;
                }
                let footer = await Fragment.load({
                    id: this.getView().getId(),
                    name: nameFragment,
                    controller: this
                })
                page.setFooter(footer)

                debugger

            },
            initialModel: async function () {
                let call = await fetch("../model/modelloDatiMock.json")
                let obj = await call.json()
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj.noteReject), "modelloDettaglio")
            },

            AlertDialog: function (oEvent) {
                debugger
                let key = oEvent.getSource().getCustomData()[0].getKey(),
                    descrizione = null
                key == "Reject" ? this.dialogReject(this, descrizione) : this.dialogConferma(this, descrizione)

            },
            dialogReject: function (self, descrizione) {
                if (!this.oDefaultMessageDialog) {
                    this.oDefaultMessageDialog = new sap.m.Dialog({
                        type: sap.m.DialogType.Message,
                        title: "Conferma",
                        content: [
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({
                                        text: "Sei sicuro di voler Rifiutare?"
                                    }),
                                    new sap.m.VBox({
                                        with: "220px",
                                        alignItems: sap.m.FlexAlignItems.Baseline,
                                        items: [
                                            new sap.m.Label({
                                                text: "Note"
                                            }),
                                            new sap.m.TextArea({
                                                value: "{modelloDialog>/data}",
                                                with: "220px"
                                            })
                                        ]
                                    })

                                ]
                            })
                        ],
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "Si",
                            press: async function () {
                                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato"),
                                    notaAggiuntiva = this.oDefaultMessageDialog.getModel("modelloDialog").getProperty("/data"),
                                    nomeutente = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome"),
                                    date = new Date()
                                let objNote = [{
                                    nota: notaAggiuntiva,
                                    utente: nomeutente,
                                    data: date
                                }]
                                let settoreutente = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")

                                await Revisioni.updateSignature({ id: elemento_selezionato.id, firma: false, utente: nomeutente, settore: settoreutente, data: { note: objNote } })

                                // await Revisioni.updateStato({ id: elemento_selezionato.id, stato: "Bloccato", note: objNote })
                                this.oDefaultMessageDialog.close();
                                MessageToast.show("Salvataggio avvenuto con successo")
                                this.handleNavigateToTable()
                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "No",
                            press: function () {
                                this.oDefaultMessageDialog.close();
                            }.bind(this)
                        })
                    })
                }
                debugger
                this.oDefaultMessageDialog.setModel(new sap.ui.model.json.JSONModel({
                    self: self,
                    data: descrizione
                }), "modelloDialog")
                this.oDefaultMessageDialog.open();
            },
            dialogConferma: function (self, descrizione) {
                if (!this.oMessageDialogConfirm) {
                    this.oMessageDialogConfirm = new sap.m.Dialog({
                        type: sap.m.DialogType.Message,
                        title: "Conferma",
                        content:
                            new sap.m.Text({
                                text: "Sei sicuro di voler confermare?"

                            }),
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "Si",
                            press: async function () {
                                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                                debugger
                                let nomeutente = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome")
                                let settoreutente = this.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")

                                let objNote = [{
                                    nota: 'Firmato',
                                    utente: nomeutente,
                                    data: new Date()
                                }]

                                await Revisioni.updateSignature({ id: elemento_selezionato.id, firma: false, utente: nomeutente, settore: settoreutente, data: { note: objNote } })
                                this.oMessageDialogConfirm.close();
                                MessageToast.show("Salvataggio avvenuto con successo")
                                this.handleNavigateToTable()
                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "No",
                            press: function () {
                                this.oMessageDialogConfirm.close();
                            }.bind(this)
                        })
                    })
                }

                this.oMessageDialogConfirm.setModel(new sap.ui.model.json.JSONModel({
                    self: self,
                    data: descrizione
                }), "modelloDialog")
                this.oMessageDialogConfirm.open();
            },
            showPopoverEntiFragment: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
                let entiSelezionati = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato/enti/entiSelezionati")
                debugger
                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "flexcollay.view.Fragments.PopoverEntiFirmatariSelect",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        debugger
                        oPopover.setModel(new sap.ui.model.json.JSONModel(), "modelloPopover")
                        oPopover.getModel("modelloPopover").setProperty("/entiSelezionati", entiSelezionati)
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
            },


        });
    });
