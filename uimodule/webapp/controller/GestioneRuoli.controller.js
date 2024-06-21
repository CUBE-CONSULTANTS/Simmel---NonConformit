sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView",
    "./BaseController",
    "../model/Utenti"
], function (Controller, XMLView, BaseController, Utenti) {
    "use strict";


    return BaseController.extend("flexcollay.controller.GestioneRuoli", {
        onInit: function () {
            //debugger
            this.getOwnerComponent()
                .getRouter()
                .getRoute("GestioneRuoli")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        addUser: function () {
            //debugger
            if (!this.oDialogNewUser) {
                this.oDialogNewUser = new sap.m.Dialog({
                    contentWidth: "550px",
                    contentHeight: "250px",
                    customHeader: new sap.m.Bar({
                        contentMiddle: [
                            new sap.m.Title({ text: "Inserimento nuovo utente" })
                        ],
                        contentRight: [
                            new sap.m.Button({
                                icon: 'sap-icon://decline',
                                type: 'Emphasized',
                                press: function (oEvent) {
                                    this.oDialogNewUser.close();
                                }.bind(this)
                            })
                        ]
                    }),
                    content: [
                        new sap.ui.layout.form.SimpleForm({
                            layout: "ResponsiveGridLayout",
                            content: [
                                new sap.m.Label({ text: "Nome", required: true }),
                                new sap.m.Input({ value: "{modelloDialog>/nome}" }),
                                new sap.m.Label({ text: "Email", required: true }),
                                new sap.m.Input({ value: "{modelloDialog>/email}" }),
                                new sap.m.Label({ text: "Ruolo", width: "50%", required: true }),
                                new sap.m.MultiComboBox({
                                    selectedKeys: '{modelloDialog>/ruolo}',
                                    items: {
                                        path: "modelloGestioneRuoli>/listaRuoli",
                                        template: new sap.ui.core.Item({
                                            key: "{modelloGestioneRuoli>nome}",
                                            text: "{modelloGestioneRuoli>nome}"
                                        })
                                    },

                                })
                            ]
                        })
                    ],
                    endButton: new sap.m.Button({
                        text: "OK",
                        type: 'Emphasized',
                        press: function (oEvent) {
                            let valoriInseriti = oEvent.getSource().getParent().getModel("modelloDialog").getProperty("/")
                            if (Object.keys(valoriInseriti).find(x => valoriInseriti[x] === null || valoriInseriti[x].length == 0) !== undefined) {
                                sap.m.MessageBox.error("Inserire tutti i campi");
                            } else {
                                sap.m.MessageBox.confirm(
                                    "Sei sicuro di voler creare un nuovo utente?", {
                                    icon: sap.m.MessageBox.Icon.INFORMATION,
                                    title: "Creazione utente",
                                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                                    emphasizedAction: sap.m.MessageBox.Action.YES,
                                    onClose: function (oAction) {
                                        if (oAction == 'YES') {
                                            this.getView().getModel("modelloListaUtenti").getProperty("/utenti").push(valoriInseriti);
                                            this.getView().getModel("modelloListaUtenti").updateBindings();
                                        }
                                        this.oDialog.close();
                                    }.bind(this)
                                })

                            }
                        }.bind(this)
                    }),
                    beginButton: new sap.m.Button({
                        text: "Annulla",
                        press: function () {
                            this.oDialog.close();
                        }.bind(this)
                    })
                });

                // Add dialog to the root view
                this.getView().addDependent(this.oDialog);
            }
            this.oDialog.setModel(new sap.ui.model.json.JSONModel(), "modelloDialog")
            this.oDialog.getModel("modelloDialog").setProperty("/", {
                nome: null,
                email: null,
                ruolo: [],
                flag: "I"
            })
            this.oDialog.open();
        },
        _onRouteMatched: function (oEvent) {
            this.initialModel()
        },
        initialModel: async function () {
            let utenti = await Utenti.getAll()

            this.getView().setModel(new sap.ui.model.json.JSONModel(), "modelloListaUtenti")
            this.getView().setModel(new sap.ui.model.json.JSONModel(), "modelloGestioneRuoli")

            this.getView().getModel("modelloListaUtenti").setProperty("/utenti", utenti)

            let listaRuoli = [{ nome: "Qualità" }, { nome: 'Ricerca e Sviluppo' }, { nome: "Logistica" }, { nome: "Acquisti" }, { nome: "PM" }]
            this.getView().getModel("modelloGestioneRuoli").setProperty("/", { listaRuoli: listaRuoli })
            //debugger
        },
        deleteUser: function (oEvent) {
            let table = this.byId("tableUser")
            const oModel = this.getView().getModel("modelloListaUtenti")
            const oData = oModel.getProperty("/utenti")
            const aSelectedIndices = table.getSelectedItems()
            if (aSelectedIndices.length === 0) {
                sap.m.MessageBox.error('Selezionare almeno una riga')
            } else {
                sap.m.MessageBox.confirm(
                    "Sei sicuro di voler eliminare gli utenti selezionati?", {
                    icon: sap.m.MessageBox.Icon.INFORMATION,
                    title: "Conferma cancellazione",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    emphasizedAction: sap.m.MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction == 'YES') {
                            let indexElementRemove = [], arrayDelete = []
                            aSelectedIndices.forEach(x => {
                                let obj = x.getBindingContext("modelloListaUtenti").getObject()
                                let index = oData.findIndex(x => x.nome == obj.nome)
                                if (index != -1) {
                                    indexElementRemove.push(index)
                                }
                            })
                            indexElementRemove.sort((a, b) => b - a);


                            indexElementRemove.forEach(indice => {
                                arrayDelete.push(oData[indice])
                                oData.splice(indice, 1);

                            });
                            aSelectedIndices.forEach(x => x.setSelected(false))
                            this.getView().getModel("modelloListaUtenti").setProperty("/utentiCancellati", arrayDelete)
                            this.getView().getModel("modelloListaUtenti").updateBindings()


                        }
                    }.bind(this)
                }
                );
            }
        },
        onSaveChangeUser: async function (oEvent) {
            let dataob = this.getView().getModel("modelloListaUtenti").getData()
            for (let i = 0; i < dataob.utenti.length; i++) {
                for (let role = 0; role < dataob.utenti[i].ruolo.length; role++) {
                    dataob.utenti[i].ruolo[role] = dataob.utenti[i].ruolo[role].replaceAll(" ", "_")
                }
            }
            const userNotChang = await Utenti.changeUser({ data: [dataob], token: this._getToken() })
            if (JSON.parse(userNotChang).length != 0) {
                sap.m.MessageBox.information("Impossibile effettuare modifiche su alcuni utenti", {
                    title: "Attenzione",
                    details: `Gli utenti ${JSON.parse(userNotChang).toString()} non possono essere modificati poichè sono coinvolti in attività ancora non concluse. \nPer modificarli concludere le attività`,
                    contentWidth: "100px",
                    actions: [sap.m.MessageBox.Action.OK],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function (oAction) {
                        this.navPagPrec()
                    }.bind(this)
                });
            } else {
                sap.m.MessageBox.success("Salvataggio avvenuto con successo", {
                    title: "Salvataggio",
                    actions: [sap.m.MessageBox.Action.OK],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function (oAction) {
                        this.navPagPrec()
                    }.bind(this)
                });
            }
        },
        navPagPrec: function () {

        },
        onSearch: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new sap.ui.model.Filter("nome", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
            var oList = this.byId("tableUser");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        }


    });
});