sap.ui.define(["./API"], function (API) {
    "use strict";

    return {
        getAll: async function () {
            return await API.getEntitySet({ entity: "/ModelNonConf/getAll" });
        },
        getOne: async function ({ id, ruolo }) {
            return await API.getEntity({ entity: `/ModelNonConf/getOne/${id}/${ruolo}` });
        },
        createFirstModel: async function ({ data }) {
            return await API.createEntity({ entity: "/ModelNonConf/createFirstModel", data });
        },
        createMany: async function ({ data }) {
            return await API.createEntity({ entity: "/ModelNonConf/create", data });
        },
        updateOne: async function ({ id, data }) {
            return await API.updateEntity({ entity: `/ModelNonConf/update/${id}`, data });
        },
        updateMany: async function ({ data }) {
            return await API.updateEntity({ entity: "/ModelNonConf/update", data });
        },
        deleteOne: async function ({ data }) {
            return await API.deleteEntity({ entity: "/ModelNonConf/delete", data });
        },
        deleteMany: async function ({ data }) {
            return await API.deleteEntity({ entity: "/ModelNonConf/delete", data });
        },
        filterid: async function ({ data }) {
            return await API.getFilterID({ entity: `/ModelNonConf/filter/${data}` });
        },
        getLast: async function () {
            return await API.getLastElement({ entity: `/ModelNonConf/last` });
        },
        createOrUpdate: async function ({ data }) {
            return await API.createEntity({ entity: "/ModelNonConf/createOrUpdate", data });
        },

    };
});
