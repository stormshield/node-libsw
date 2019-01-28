'use strict'

const request = require('superagent')

const config = require('./config.json')
const {getData, TAGS} = require('./get-data')

module.exports = {
	OBJ_RELEASE: 'Release',
	OBJ_SPRINT: 'Sprint',
	OBJ_BACKLOG_ITEM: 'BacklogItem',
	OBJ_TASK: 'Task',
	async addTagOnObject(opts, tagId, objectType, objectId) {
		const res = await request
			.post(`${config.url}/addTagOnObject`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				tagID: tagId,
				objectType,
				objectID: objectId
			})
		return res.body
	},
	async getAll(opts, filter = {}) {
		const data = await getData(opts, TAGS)
		return data.result.projects[0].tags.filter(tag => {
			for (const field of Object.keys(filter)) {
				if (tag[field] !== filter[field]) {
					return false
				}
			}
			return true
		})
	},
	async getOne(opts, filter = {}) {
		const tags = await this.getAll(opts, filter)
		return tags[0]
	},
	async getById(opts, tagId) {
		const tag = await this.getOne(opts, {id: tagId})
		if (!tag) {
			throw new Error(`No tag found with id "${tagId}"`)
		}
		return tag
	},
	async getByName(opts, tagName) {
		const tag = await this.getOne(opts, {name: tagName})
		if (!tag) {
			throw new Error(`No tag found with name "${tagName}"`)
		}
		return tag
	},
	async removeTagFromObject(opts, tagId, objectType, objectId) {
		const res = await request
			.post(`${config.url}/removeTagFromObject`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				tagID: tagId,
				objectType,
				objectID: objectId
			})
		return res.body
	}
}
