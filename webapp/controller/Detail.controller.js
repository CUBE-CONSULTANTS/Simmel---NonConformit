sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast', "./BaseController",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, BaseController, Fragment) {
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
            handleNavigateToTable: function () {
                debugger
                this.bus.publish("flexible", "setListPage");
            },
            // AlertDialog: function (oEvent) {
            //     debugger
            //     let key = oEvent.getSource().getCustomData()[0].getKey(),
            //         descrizione = null
            //     key == "Reject" ? this.dialogReject(this, descrizione) : this.dialogConferma(this, descrizione)

            // },
            // dialogReject: function (self, descrizione) {
            //     if (!this.oDefaultMessageDialog) {
            //         this.oDefaultMessageDialog = new sap.m.Dialog({
            //             type: sap.m.DialogType.Message,
            //             title: "Conferma",
            //             content: [
            //                 new sap.m.VBox({
            //                     items: [
            //                         new sap.m.Text({
            //                             text: "Sei sicuro di voler Rifiutare?"
            //                         }),
            //                         new sap.m.VBox({
            //                             with: "220px",
            //                             alignItems: sap.m.FlexAlignItems.Baseline,
            //                             items: [
            //                                 new sap.m.Label({
            //                                     text: "Note"
            //                                 }),
            //                                 new sap.m.TextArea({
            //                                     value: null,
            //                                     with: "220px"
            //                                 })
            //                             ]
            //                         })

            //                     ]
            //                 })
            //             ],
            //             beginButton: new sap.m.Button({
            //                 type: sap.m.ButtonType.Emphasized,
            //                 text: "Si",
            //                 press: function () {
            //                     this.saveData()
            //                     this.oDefaultMessageDialog.close();
            //                     MessageToast.show("Salvataggio avvenuto con successo")
            //                 }.bind(this)
            //             }),
            //             endButton: new sap.m.Button({
            //                 type: sap.m.ButtonType.Emphasized,
            //                 text: "No",
            //                 press: function () {
            //                     this.oDefaultMessageDialog.close();
            //                 }.bind(this)
            //             })
            //         })
            //     }
            //     debugger
            //     this.oDefaultMessageDialog.setModel(new sap.ui.model.json.JSONModel({
            //         self: self,
            //         data: descrizione
            //     }), "modelloDialog")
            //     this.oDefaultMessageDialog.open();
            // },

            // dialogConferma: function (self, descrizione) {
            //     if (!this.oMessageDialogConfirm) {
            //         this.oMessageDialogConfirm = new sap.m.Dialog({
            //             type: sap.m.DialogType.Message,
            //             title: "Conferma",
            //             content:
            //                 new sap.m.Text({
            //                     text: "Sei sicuro di voler confermare?"

            //                 }),
            //             beginButton: new sap.m.Button({
            //                 type: sap.m.ButtonType.Emphasized,
            //                 text: "Si",
            //                 press: function () {
            //                     this.saveData()
            //                     this.oMessageDialogConfirm.close();
            //                     MessageToast.show("Salvataggio avvenuto con successo")
            //                 }.bind(this)
            //             }),
            //             endButton: new sap.m.Button({
            //                 type: sap.m.ButtonType.Emphasized,
            //                 text: "No",
            //                 press: function () {
            //                     this.oMessageDialogConfirm.close();
            //                 }.bind(this)
            //             })
            //         })
            //     }
            //     debugger
            //     this.oDefaultMessageDialog.setModel(new sap.ui.model.json.JSONModel({
            //         self: self,
            //         data: descrizione
            //     }), "modelloDialog")
            //     this.oDefaultMessageDialog.open();
            // },
            AlertDialog: function (oEvent) {
                debugger
                let key = oEvent.getSource().getCustomData()[0].getKey(),
                    descrizione = null
                key == "Reject" ? this.dialogReject(this, descrizione) : this.dialogConferma(this, descrizione, key)

            },
            dialogReject: function (self, descrizione) {
                if (!this.oDefaultMessageDialog) {
                    this.oDefaultMessageDialog = new sap.m.Dialog({
                        type: sap.m.DialogType.Message,
                        title: "Rifiuta",
                        content: [

                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({
                                        text: "Sei sicuro di voler Rifiutare?"
                                    }),
                                    new sap.m.VBox({
                                        width: "auto",
                                        alignItems: sap.m.FlexAlignItems.Baseline,
                                        items: [
                                            new sap.m.Label({
                                                text: "Note"
                                            }),
                                            new sap.m.TextArea({
                                                value: "{modelloDialog>/data}",
                                                width: "260px"
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
                                debugger

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
            dialogConferma: function (self, descrizione, key) {
                new sap.m.MessageBox.show(
                    "Sei sicuro di voler confermare?", {
                    icon: sap.m.MessageBox.Icon.SUCCESS,
                    title: "Salvataggio",
                    content: [key, self],
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: async function (sAction) {
                        debugger
                        let self = this.content[1]
                        if (sAction == 'YES') {
                            let elemento_selezionato = self.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                            if (this.content[0] === 'Chiusura') {
                                self.getOwnerComponent().getModel("modelloAppoggio").setProperty("/elemento_selezionato/stato", "Chiuso")
                                let index = self.getOwnerComponent().getModel("modello").getProperty("/non_conformita").findIndex(x => x === elemento_selezionato)
                                self.getOwnerComponent().getModel("modello").setProperty(`/non_conformita/${index}/stato`, 'Chiuso')
                                self.getOwnerComponent().getModel("modello").updateBindings()
                                // await Revisioni.updateStato({ id: elemento_selezionato.id, stato: 'Chiuso' })
                                debugger

                            } else {
                                // let nomeutente = self.getOwnerComponent().getModel("modelloRuolo").getProperty("/nome")
                                // let settoreutente = self.getOwnerComponent().getModel("modelloRuolo").getProperty("/settore")

                                // let objNote = [{
                                //     nota: 'Firmato',
                                //     utente: nomeutente,
                                //     data: new Date()
                                // }]

                                // await Revisioni.updateSignature({ id: elemento_selezionato.id, firma: true, utente: nomeutente, settore: settoreutente, data: { note: objNote } })
                                MessageToast.show("Salvataggio avvenuto con successo")
                                self.handleNavigateToTable()
                            }
                        }
                    }
                }
                );
            },
            saveData: function () { //funzione per il salvataggio dei dati

            },
            onNewRev: function (oEvent, state) {
                debugger
                let elemento_selezionato = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato")
                this.openDialogCreaRevisione(oEvent, elemento_selezionato, state)
            },
            showPopoverEntiFragment: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
                let entiSelezionati = this.getOwnerComponent().getModel("modelloAppoggio").getProperty("/elemento_selezionato/ENTI/entiSelezionati")
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
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    debugger
                    oPopover.getModel("modelloPopover").setProperty("/entiSelezionati", entiSelezionati)
                    oPopover.openBy(oButton);
                });
            },

        });
    });
