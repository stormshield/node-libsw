'use strict'

const basicAuth = require('basic-auth')
const MockServer = require('mock-http-server')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Tasks', function () {
	const server = new MockServer({host: 'localhost', port: 0})
	let mockBacklogItemsList
	let mockBacklogItems
	let tasks
	let url

	beforeEach(function (done) {
		mockBacklogItemsList = [{
			name: 'backlog-item',
			tasks: [{
				id: 'task',
				taskNumber: 1
			}]
		}]
		mockBacklogItems = {
			getAll: sinon.stub().resolves(mockBacklogItemsList)
		}
		server.start(() => {
			url = `http://localhost:${server.getHttpPort()}`
			tasks = proxyquire('../src/tasks', {
				'./config.json': {url},
				'./backlog-items': mockBacklogItems
			})
			done()
		})
	})

	afterEach(function (done) {
		server.stop(done)
	})

	describe('#addTask', function () {
		let mockRes

		beforeEach(function () {
			mockRes = {result: {}}
			server.on({
				method: 'POST',
				path: '/addTask',
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
			const backlogItemId = 'backlog-item'
			const task = {
				name: 'task-name'
			}

			// when
			const res = await tasks.addTask(options, backlogItemId, task)

			// then
			res.should.eql(mockRes)
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql(Object.assign({backlogItemID: backlogItemId}, task))
		})
	})

	describe('#delete', function () {
		beforeEach(function () {
			server.on({
				method: 'POST',
				path: '/deleteTask',
				reply: {
					status: 200
				}
			})
		})

		it('should call API with provided data', async function () {
			// given
			const options = {
				email: 'email',
				apikey: 'apikey'
			}
			const taskId = 'task'

			// when
			await tasks.delete(options, taskId)

			// then
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql({taskID: taskId})
		})
	})

	describe('#getOne', function () {
		it('should throw if no backlog item was found', function () {
			// given
			mockBacklogItemsList.pop()

			// then
			return tasks.getOne({}, 'task').should.be.rejectedWith('No backlog item found')
		})

		it('should return undefined if not task was found', function () {
			// then
			return tasks.getOne({}, {id: 'unknown'}).should.become(undefined)
		})

		it('should pass getTasksComments option to BacklogItems.getAll if getComments option was passed', async function () {
			// given
			const options = {getComments: true}
			
			// when
			await tasks.getOne(options)

			// then
			mockBacklogItems.getAll.should.have.been.calledWith(Object.assign({
				getTasks: true,
				getTasksComments: true
			}, options))
		})

		it('should filter backlog item and return task', async function () {
			// given
			const options = {a: 1}

			// when
			const res = await tasks.getOne(options)

			// then
			mockBacklogItems.getAll.should.have.been.calledWith(Object.assign({getTasks: true}, options))
			res.should.eql(mockBacklogItemsList[0].tasks[0])
		})
	})

	describe('#getById', function () {
		it('should throw if task does not exist', function () {
			// then
			return tasks.getById({}, 'unknown').should.be.rejectedWith('No task found with id "unknown"')
		})

		it('should filter backlog item and return task', async function () {
			// given
			const options = {a: 1}

			// when
			const res = await tasks.getById(options, 'task')

			// then
			res.should.eql(mockBacklogItemsList[0].tasks[0])
		})
	})

	describe('#getByNumber', function () {
		it('should throw if task does not exist', function () {
			// then
			return tasks.getByNumber({}, '0').should.be.rejectedWith('No task found with number "0"')
		})

		it('should filter backlog item and return task', async function () {
			// given
			const options = {a: 1}

			// when
			const res = await tasks.getByNumber(options, '1')

			// then
			res.should.eql(mockBacklogItemsList[0].tasks[0])
		})
	})

	describe('#moveTaskToBoardColumn', function () {
		let mockRes

		beforeEach(function () {
			mockRes = {result: {}}
			server.on({
				method: 'POST',
				path: '/moveTaskToBoardColumn',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
		})

		it('should call API with provided data', async function () {
			// given
			const options = {
				email: 'email',
				apikey: 'apikey'
			}
			const taskId = 'task'
			const boardColumnId = 'columnId'
			const assignedPersonId = 'personId'

			// when
			await tasks.moveTaskToBoardColumn(options, taskId, boardColumnId, assignedPersonId)

			// then
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql({taskID: taskId, boardColumnID: boardColumnId, assignedPersonID: assignedPersonId})
		})
	})

	describe('#setTaskDescription', function () {
		let mockRes

		beforeEach(function () {
			mockRes = {result: {}}
			server.on({
				method: 'POST',
				path: '/setTaskDescription',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
		})

		it('should call API with provided data', async function () {
			// given
			const options = {
				email: 'email',
				apikey: 'apikey'
			}
			const taskId = 'task'
			const description = 'description'

			// when
			await tasks.setTaskDescription(options, taskId, description)

			// then
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql({taskID: taskId, description})
		})
	})

	describe('#setTaskName', function () {
		let mockRes

		beforeEach(function () {
			mockRes = {result: {}}
			server.on({
				method: 'POST',
				path: '/setTaskName',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
		})

		it('should call API with provided data', async function () {
			// given
			const options = {
				email: 'email',
				apikey: 'apikey'
			}
			const taskId = 'task'
			const name = 'name'

			// when
			await tasks.setTaskName(options, taskId, name)

			// then
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: options.email,
				pass: options.apikey
			})
			req.body.should.eql({taskID: taskId, name})
		})
	})
})
