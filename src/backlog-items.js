'use strict'

const {getData, BACKLOG_ITEM_COMMENTS, BACKLOG_ITEMS, TASK_COMMENTS, TASKS} = require('./get-data')

function getBacklogItemReducer(fields) {
	return function backlogItemReducer(acc, item) {
		if (!Array.isArray(item.childBacklogItems) || item.childBacklogItems.length === 0) {
			const isToKeep = Object.keys(fields).reduce((isToKeep, field) => {
				if (!isToKeep) {
					return isToKeep
				}
				if (typeof item[field] === 'number') {
					item[field] = String(item[field])
				}
				return item[field] === fields[field]
			}, true)
			return isToKeep ? [...acc, item] : acc
		}
		return item.childBacklogItems.reduce(backlogItemReducer, acc)
	}
}

module.exports = {
	async getAll(opts, filter = {}) {
		const objects = [BACKLOG_ITEMS]
		if (opts.getComments === true) {
			objects.push(BACKLOG_ITEM_COMMENTS)
		}
		if (opts.getTasks === true) {
			objects.push(TASKS)
		}
		if (opts.getTasksComments === true) {
			objects.push(TASK_COMMENTS)
		}
		const data = await getData(opts, ...objects)
		return data.result.projects[0].backlogItems.reduce(getBacklogItemReducer(filter), [])
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
