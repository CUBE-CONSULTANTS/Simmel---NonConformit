sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function ({ ruolo, nome, token }) {
            return await API.getEntitySet({ entity: `/Revisioni/getAllModel/${ruolo}/${nome}`, token });
        },
        getOne: async function ({ id, ruolo, token }) {
            return await API.getEntity({ entity: `/Revisioni/getOne/${id}/${ruolo}`, token });
        },
        createOne: async function ({ data, token }) {
            return await API.createEntity({ entity: "/Revisioni/createRevisione", data, token });
        },
        createMany: async function ({ data, token }) {
            return await API.createEntity({ entity: "/Revisioni/create", data, token });
        },
        updateOne: async function ({ id, data, token }) {
            return await API.updateEntity({ entity: `/Revisioni/update/${id}`, data, token });
        },
        updateMany: async function ({ data, token }) {
            return await API.updateEntity({ entity: "/Revisioni/update", data, token });
        },
        deleteOne: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/Revisioni/delete", data, token });
        },
        deleteMany: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/Revisioni/delete", data, token });
        },
        filterid: async function ({ data, token }) {
            return await API.getFilterID({ entity: `/Revisioni/filter/${data}`, token });
        },
        getLast: async function ({ token }) {
            return await API.getLastElement({ entity: `/Revisioni/last`, token });
        },
        createOrUpdate: async function ({ data, token }) {
            return await API.createEntity({ entity: "/Revisioni/createOrUpdate", data, token });
        },

        updateStato: async function ({ id, stato, token }) {
            return await API.updateEntity({ entity: `/Revisioni/updateStato/${id}/${stato}`, token });
        },


        updateSignature: async function ({ id, firma, utente, settore, data, token }) {
            return await API.updateEntity({ entity: `/Revisioni/updateSignature/${id}/${firma}/${utente}/${settore}`, data, token });
        },

        sendEmail: async function ({ id, token }) {
            return await API.getEntitySet({ entity: `/Revisioni/sendEmail/${id}`, token });
        },
        setVisibilityByStateAndSignature: async function ({ id, user, token }) {
            return await API.getEntitySet({ entity: `/Revisioni/setVisibilityByStateAndSignature/${id}/${user}`, token });
        },
    };
});
