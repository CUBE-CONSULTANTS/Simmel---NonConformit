sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("flexcollay.controller.FlexibleColumnLayout", {
            onInit: function () {
                this.bus = this.getOwnerComponent().getEventBus();
                this.initialModel()
            },
            initialModel: async function () {
                let call = await fetch("../model/modelloDatiMock.json")
                let obj = await call.json()
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj.noteReject), "modelloDettaglio")
            },
            handleNavigateToTable: function () {
                this.bus.publish("flexible", "setListPage");
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
                                                value: null,
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
                            press: function () {
                                this.saveData()
                                this.oDefaultMessageDialog.close();
                                MessageToast.show("Salvataggio avvenuto con successo")
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
                            press: function () {
                                this.saveData()
                                this.oMessageDialogConfirm.close();
                                MessageToast.show("Salvataggio avvenuto con successo")
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
                debugger
                this.oDefaultMessageDialog.setModel(new sap.ui.model.json.JSONModel({
                    self: self,
                    data: descrizione
                }), "modelloDialog")
                this.oDefaultMessageDialog.open();
            },
            saveData: function () { //funzione per il salvataggio dei dati

            },
            openDialogShowPDF: function (oEvent) {
                let self = this
                if (!this._dialog) {
                    this._dialog = new sap.ui.core.Fragment.load({
                        id: this.getView().getId(),
                        name: "flexcollay.view.Fragments.PdfFragment",
                        controller: this
                    }).then(function (oDialog) {
                        debugger
                        return oDialog;
                    });
                }
                self._dialog.then(async function (oDialog) {
                    oDialog.open();

                }.bind(this));
            },
            closeDialog: function (oEvent) {
                oEvent.getSource().getParent().getParent().close()
            },
        });
    });
