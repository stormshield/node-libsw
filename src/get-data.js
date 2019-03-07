'use strict'

const request = require('superagent')
const config = require('./config.json')

module.exports = {
	BACKLOG_ITEM_COMMENTS: 'BacklogItem.comments',
	BACKLOG_ITEMS: 'Project.backlogItems',
	BOARDS: 'Project.boards',
	DELETED_PERSONS: 'Data.deletedPersons',
	SPRINTS: 'Project.sprints',
	PERSONS: 'Data.persons',
	TAGS: 'Project.tags',
	TASK_COMMENTS: 'Task.comments',
	TASKS: 'BacklogItem.tasks',
	TEAMS: 'Project.teams',
	async getData(opts, ...objects) {
		const params = {
			projectIDs: opts.projectid
		}
		if (Array.isArray(objects) && objects.length > 0) {
			params.includeProperties = objects.join(',')
		}
		const res = await request
			.post(`${config.url}/getData`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send(params)
		return res.body
	},
	async getDataVersion(opts) {
		const res = await request
			.post(`${config.url}/getDataVersion`)
			.auth(opts.email, opts.apikey)
			.send()
		return res.body
	}
}
