// ==UserScript==
// @name         Check SF LMS Support Queue
// @namespace    http://github.com/tidusx18
// @updateURL    https://github.com/tidusx18/salesforce-notifications/raw/master/Check_LMS_Support_Queue.user.js
// @version      0.0.3
// @author       Daniel Victoriano <victoriano518@gmail.com>
// @match        https://fiuonline.lightning.force.com/lightning/*
// @run-at       default
// @noframes
// @grant        GM_notification
// ==/UserScript==

(function() {

    setInterval( () => {

        message =
            {
            "actions": [
                {
                    "id": "11139;a",
                    "descriptor": "serviceComponent://ui.force.components.controllers.lists.listViewManagerGrid.ListViewManagerGridController/ACTION$getRecordLayoutComponent",
                    "callingDescriptor": "UNKNOWN",
                    "params":
                    {
                        "listReference":
                        {
                            "entityKeyPrefixOrApiName": "Case",
                            "listViewIdOrName": "00BF0000006iTxHMAU",
                            "inContextOfRecordId": null,
                            "isMRU": false,
                            "isSearch": false
                        },
                        "layoutType": "LIST",
                        "layoutMode": "EDIT",
                        "inContextOfComponent": "force:listViewManagerGrid",
                        "enableMassActions": true,
                        "enableRowErrors": true
                    }
                },
                {
                    "id": "11142;a",
                    "descriptor": "serviceComponent://ui.force.components.controllers.lists.listViewDataManager.ListViewDataManagerController/ACTION$getItems",
                    "callingDescriptor": "UNKNOWN",
                    "params":
                    {
                        "filterName": "00BF0000006iTxHMAU",
                        "entityName": "Case",
                        "pageSize": 50,
                        "layoutType": "LIST",
                        "sortBy": null,
                        "getCount": false,
                        "enableRowActions": false,
                        "offset": 0
                    },
                    "storable": true
                }]
        }

        auraContext =
            {
            "mode": "PROD",
            "fwuid": `${$A.vb.hh}`,
            "app": "one:one",
            "loaded":
            {
                "APPLICATION@markup://one:one": `${$A.vb.loaded['APPLICATION@markup://one:one']}`
            },
            "dn": [],
            "globals":
            {
                "density": "VIEW_ONE",
                "appContextId": $A.get("$Global.appContextId")
            },
            "uad": true
        }

        // update as needed to edit notification params
        dispatchNotification = () => {
            GM_notification({
                text: 'Check LMS Queue.',
                title: 'Pending Case(s) in LMS Queue',
                highlight: false,
                timeout: 10000 // time is in milliseconds (1000 == 1 second)
            })
        }

        message = encodeURIComponent(JSON.stringify(message))
        auraContext = encodeURIComponent(JSON.stringify(auraContext))
        pageURI = `aura.pageURI="/lightning/o/Case/list?filterName=00BF0000006iTxHMAU"`
        token = `aura.token=${$A.clientService.Ac}`

        url = 'https://fiuonline.lightning.force.com/aura?r=35&ui-force-components-controllers-lists-listViewDataManager.ListViewDataManager.getItems=1&ui-force-components-controllers-lists-listViewManagerGrid.ListViewManagerGrid.getRecordLayoutComponent=1'

        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-SFDC-Request-Id': '841343250000f9f413'
            },
            body: `message=${message}&aura.context=${auraContext}&${pageURI}&${token}`
        })
            .then( res => res.json() )
            .then( res => res.context.globalValueProviders[5] ? dispatchNotification() : console.log('Nothing in queue...') )

    }, 600000) // time is in milliseconds (1000 == 1 second)