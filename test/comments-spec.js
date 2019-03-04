'use strict'

const basicAuth = require('basic-auth')
const MockServer = require('mock-http-server')
const proxyquire = require('proxyquire')

describe('Comments', function () {
	const server = new MockServer({host: 'localhost', port: 0})
	let comments
	let url

	beforeEach(function (done) {
		server.start(() => {
			url = `http://localhost:${server.getHttpPort()}`
			comments = proxyquire('../src/comments', {
				'./config.json': {url}
			})
			done()
		})
	})

	afterEach(function (done) {
		server.stop(done)
	})

	describe('#addComment', function () {
		let mockRes

		beforeEach(function () {
			mockRes = {result: {}}
			server.on({
				method: 'POST',
				path: '/addComment',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
		})

		it('should call API with provided data and return response', async function () {
			// given
			const options = {
				email: 'email',
				apikey: 'apikey'
			}
			const objectType = 'objectType'
			const objectId = 'objectId'
			const parentId = 'parentId'
			const text = 'text'

			// when
			const res = await comments.addComment(options, objectType, objectId, parentId, text)

			// then
			res.should.eql(mockRes)
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql({
				ownerObjectType: objectType,
				ownerObjectID: objectId,
				parentCommentID: parentId,
				text
			})
		})
	})

	describe('#deleteComment', function () {
		let mockRes

		beforeEach(function () {
			mockRes = {result: {}}
			server.on({
				method: 'POST',
				path: '/deleteComment',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
		})

		it('should call API with provided data and return response', async function () {
			// given
			const options = {
				email: 'email',
				apikey: 'apikey'
			}
			const commentId = 'commentId'

			// when
			const res = await comments.deleteComment(options, commentId)

			// then
			res.should.eql(mockRes)
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql({
				commentID: commentId
			})
		})
	})

	describe('#setCommentText', function () {
		let mockRes

		beforeEach(function () {
			mockRes = {result: {}}
			server.on({
				method: 'POST',
				path: '/setCommentText',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
		})

		it('should call API with provided data and return response', async function () {
			// given
			const options = {
				email: 'email',
				apikey: 'apikey'
			}
			const commentId = 'commentId'
			const text = 'text'

			// when
			const res = await comments.setCommentText(options, commentId, text)

			// then
			res.should.eql(mockRes)
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql({
				commentID: commentId,
				text
			})
		})
	})
})
