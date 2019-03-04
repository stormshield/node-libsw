'use strict'

const request = require('superagent')

const BacklogItems = require('./backlog-items')
const config = require('./config.json')

function taskFilter(fields = {}) {
	return task => {
		return Object.keys(fields).reduce((isToKeep, field) => {
			if (!isToKeep) {
				return isToKeep
			}
			if (typeof task[field] === 'number') {
				task[field] = String(task[field])
			}
			return task[field] === fields[field]
		}, true)
	}
}

module.exports = {
	async addTask(opts, backlogItemId, task) {
		const res = await request
			.post(`${config.url}/addTask`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				backlogItemID: backlogItemId,
				...task
			})
		return res.body
	},
	async delete(opts, taskId) {
		await request
			.post(`${config.url}/deleteTask`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({taskID: taskId})
	},
	async getOne(opts, filter = {}) {
		if (opts.getComments) {
			opts.getTasksComments = true
			delete opts.getComments
		}
		const backlogItems = await BacklogItems.getAll({getTasks: true, ...opts})
		if (backlogItems.length === 0) {
			throw new Error('No backlog item found')
		}
		for (const backlogItem of backlogItems) {
			const filteredTasks = backlogItem.tasks.filter(taskFilter(filter))
			if (filteredTasks.length > 0) {
				return filteredTasks[0]
			}
		}
	},
	async getById(opts, taskId) {
		const task = await this.getOne(opts, {id: taskId})
		if (!task) {
			throw new Error(`No task found with id "${taskId}"`)
		}
		return task
	},
	async getByNumber(opts, taskNumber) {
		const task = await this.getOne(opts, {taskNumber})
		if (!task) {
			throw new Error(`No task found with number "${taskNumber}"`)
		}
		return task
	},
	async moveTaskToBoardColumn(opts, taskId, boardColumnId, assignedPersonId = null) {
		const data = {
			taskID: taskId,
			boardColumnID: boardColumnId
		}
		if (assignedPersonId) {
			data.assignedPersonID = assignedPersonId
		}
		await request
			.post(`${config.url}/moveTaskToBoardColumn`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send(data)
	},
	async setTaskDescription(opts, taskId, description) {
		await request
			.post(`${config.url}/setTaskDescription`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				taskID: taskId,
				description
			})
	},
	async setTaskName(opts, taskId, name) {
		await request
			.post(`${config.url}/setTaskName`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				taskID: taskId,
				name
			})
	}
}
