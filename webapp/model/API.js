sap.ui.define([], function () {
    "use strict";

    const endpoint = "http://localhost:3000";

    return {
        getEntitySet: function ({ entity }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${endpoint}${entity}`,
                    type: "GET",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        getExpandedEntitySet: function ({ entity, data }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${endpoint}${entity}`,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        getEntity: function ({ entity }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    type: "GET",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        createEntity: function ({ entity, data }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        updateEntity: function ({ entity, data }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },

        deleteEntity: function ({ entity }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    type: "DELETE",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },
        getFilter: function ({ entity }) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: endpoint + entity,
                    type: "GET",
                    contentType: "application/json",
                    success: (res) => resolve(res),
                    error: (e) => reject(e),
                });
            });
        },
    };
});
