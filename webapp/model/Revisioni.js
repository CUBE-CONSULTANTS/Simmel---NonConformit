sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function ({ ruolo }) {
            return await API.getEntitySet({ entity: `/Revisioni/getAllModel/${ruolo}` });
        },
        getOne: async function ({ id, ruolo }) {
            return await API.getEntity({ entity: `/Revisioni/getOne/${id}/${ruolo}` });
        },
        createOne: async function ({ data }) {
            return await API.createEntity({ entity: "/Revisioni/create", data });
        },
        createMany: async function ({ data }) {
            return await API.createEntity({ entity: "/Revisioni/create", data });
        },
        updateOne: async function ({ id, data }) {
            return await API.updateEntity({ entity: `/Revisioni/update/${id}`, data });
        },
        updateMany: async function ({ data }) {
            return await API.updateEntity({ entity: "/Revisioni/update", data });
        },
        deleteOne: async function ({ data }) {
            return await API.deleteEntity({ entity: "/Revisioni/delete", data });
        },
        deleteMany: async function ({ data }) {
            return await API.deleteEntity({ entity: "/Revisioni/delete", data });
        },
        filterid: async function ({ data }) {
            return await API.getFilterID({ entity: `/Revisioni/filter/${data}` });
        },
        getLast: async function () {
            return await API.getLastElement({ entity: `/Revisioni/last` });
        },
        createOrUpdate: async function ({ data }) {
            return await API.createEntity({ entity: "/Revisioni/createOrUpdate", data });
        },

        updateStato: async function ({ id, stato, data: note }) {
            return await API.updateEntity({ entity: `/Revisioni/updateStato/${id}/${stato}`, data: note });
        },


        updateSignature: async function ({ id, firma, utente, settore, data }) {
            return await API.updateEntity({ entity: `/Revisioni/updateSignature/${id}/${firma}/${utente}/${settore}`, data });
        },


    };
});
