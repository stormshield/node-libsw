'use strict'

const request = require('superagent')
const config = require('./config.json')

module.exports = {
	async addComment(opts, ownerObjectType, ownerObjectId, parentCommentId, text) {
		const res = await request
			.post(`${config.url}/addComment`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				ownerObjectType,
				ownerObjectID: ownerObjectId,
				parentCommentID: parentCommentId,
				text
			})
		return res.body
	},
	async deleteComment(opts, commentId) {
		const res = await request
			.post(`${config.url}/deleteComment`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				commentID: commentId
			})
		return res.body
	},
	async setCommentText(opts, commentId, text) {
		const res = await request
			.post(`${config.url}/setCommentText`)
			.auth(opts.email, opts.apikey)
			.type('form')
			.send({
				commentID: commentId,
				text
			})
		return res.body
	}
}
