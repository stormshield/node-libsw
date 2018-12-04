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

  describe('#getById', function () {
    it('should throw if no backlog item was found', function () {
      // given
      mockBacklogItemsList.pop()

      // then
      return tasks.getById({}, 'task').should.be.rejectedWith('No backlog item found')
    })

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
      mockBacklogItems.getAll.should.have.been.calledWith(Object.assign({getTasks: true}, options))
      res.should.eql(mockBacklogItemsList[0].tasks[0])
    })
  })

  describe('#getByNumber', function () {
    it('should throw if no backlog item was found', function () {
      // given
      mockBacklogItemsList.pop()

      // then
      return tasks.getByNumber({}, '1').should.be.rejectedWith('No backlog item found')
    })

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
      mockBacklogItems.getAll.should.have.been.calledWith(Object.assign({getTasks: true}, options))
      res.should.eql(mockBacklogItemsList[0].tasks[0])
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

    it('should call API with provided data and return response', async function () {
      // given
      const options = {
        email: 'email',
        apikey: 'apikey'
      }
      const taskId = 'task'
      const description = 'description'

      // when
      const res = await tasks.setTaskDescription(options, taskId, description)

      // then
      res.should.eql(mockRes)
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

    it('should call API with provided data and return response', async function () {
      // given
      const options = {
        email: 'email',
        apikey: 'apikey'
      }
      const taskId = 'task'
      const name = 'name'

      // when
      const res = await tasks.setTaskName(options, taskId, name)

      // then
      res.should.eql(mockRes)
      const req = server.requests()[0]
      basicAuth.parse(req.headers['authorization']).should.eql({
        name: options.email,
        pass: options.apikey
      })
      req.body.should.eql({taskID: taskId, name})
    })
  })
})
