sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function ({ token }) {
            return await API.getEntitySet({ entity: "/ModelNonConf/getAll" });
        },
        getOne: async function ({ id, ruolo, token }) {
            return await API.getEntity({ entity: `/ModelNonConf/getOne/${id}/${ruolo}`, token });
        },
        createFirstModel: async function ({ data, token }) {
            return await API.createEntity({ entity: "/ModelNonConf/createFirstModel", data, token });
        },
        createMany: async function ({ data, token }) {
            return await API.createEntity({ entity: "/ModelNonConf/create", data, token });
        },
        updateOne: async function ({ id, data, token }) {
            return await API.updateEntity({ entity: `/ModelNonConf/update/${id}`, data, token });
        },
        updateMany: async function ({ data, token }) {
            return await API.updateEntity({ entity: "/ModelNonConf/update", data, token });
        },
        deleteOne: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/ModelNonConf/delete", data, token });
        },
        deleteMany: async function ({ data, token }) {
            return await API.deleteEntity({ entity: "/ModelNonConf/delete", data, token });
        },
        filterid: async function ({ data, token }) {
            return await API.getFilterID({ entity: `/ModelNonConf/filter/${data}`, token });
        },
        getLast: async function ({ token }) {
            return await API.getLastElement({ entity: `/ModelNonConf/last`, token });
        },
        createOrUpdate: async function ({ data, token }) {
            return await API.createEntity({ entity: "/ModelNonConf/createOrUpdate", data, token });
        },
        updateModelAndRev: async function ({ id, data, objrev, token }) {
            return await API.updateModelAndRev({ entity: `/ModelNonConf/updateModelAndRev/${id}`, data: [data, objrev], token });
        },
    };
});
