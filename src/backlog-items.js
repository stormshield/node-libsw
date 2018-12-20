'use strict'

const {getData, BACKLOG_ITEMS, TASKS} = require('./get-data')

function filterBacklogItem(item, filter = {}) {
    if (!Array.isArray(item.childBacklogItems) || item.childBacklogItems.length === 0) {
        for (const field of Object.keys(filter)) {
            if (typeof item[field] === 'number') {
                item[field] = String(item[field])
            }
            if (item[field] !== filter[field]) {
                return []
            }
        }
        return item
    }
    return [].concat(...item.childBacklogItems.map(item => filterBacklogItem(item, filter)))
}

module.exports = {
    async getAll(opts, filter = {}) {
        const objects = [BACKLOG_ITEMS]
        if (opts.getTasks === true) {
            objects.push(TASKS)
        }
        const data = await getData(opts, ...objects)
        return [].concat(...data.result.projects[0].backlogItems.map(backlogItem => filterBacklogItem(backlogItem, filter)))
    },
    async getOne(opts, filter = {}) {
        const backlogItems = await this.getAll(opts, filter)
        return backlogItems[0]
    },
    async getById(opts, backlogItemId) {
        const backlogItem = await this.getOne(opts, {id: backlogItemId})
        if (!backlogItem) {
            throw new Error(`No backlog item found with id "${backlogItemId}"`)
        }
        return backlogItem
    },
    async getByItemNumber(opts, itemNumber) {
        const backlogItem = await this.getOne(opts, {itemNumber})
        if (!backlogItem) {
            throw new Error(`No backlog item found with number "${itemNumber}"`)
        }
        return backlogItem
    },
    async getByTeamIdAndSprintId(opts, teamId, sprintId) {
        const backlogItems = await this.getAll(opts, {
            sprintID: sprintId,
            teamID: teamId
        })
        if (backlogItems.length === 0) {
            throw new Error(`No backlog item assigned to team with id "${teamId}" and to sprint with id "${sprintId}"`)
        }
        return backlogItems
    }
}
