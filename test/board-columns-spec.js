'use strict'

const MockServer = require('mock-http-server')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Board columns', function () {
	const server = new MockServer({host: 'localhost', port: 0})
	let mockBoardsList
	let mockBoards
	let columns
	let url

	beforeEach(function (done) {
		mockBoardsList = [{
			name: 'board',
			columns: [{
				id: 'column',
				name: 'column'
			}]
		}]
		mockBoards = {
			getAll: sinon.stub().resolves(mockBoardsList)
		}
		server.start(() => {
			url = `http://localhost:${server.getHttpPort()}`
			columns = proxyquire('../src/board-columns', {
				'./config.json': {url},
				'./boards': mockBoards
			})
			done()
		})
	})

	afterEach(function (done) {
		server.stop(done)
	})

	describe('#getById', function () {
		it('should throw if no board was found', function () {
			// given
			mockBoardsList.pop()

			// then
			return columns.getById({}, 'column').should.be.rejectedWith('No board found')
		})

		it('should throw if column does not exist', function () {
			// then
			return columns.getById({}, 'unknown').should.be.rejectedWith('No board column found with id "unknown"')
		})

		it('should filter board and return column', async function () {
			// given
			const options = {a: 1}

			// when
			const res = await columns.getById(options, 'column')

			// then
			mockBoards.getAll.should.have.been.calledWith(options)
			res.should.eql(mockBoardsList[0].columns[0])
		})
	})

	describe('#getByName', function () {
		it('should throw if no board was found', function () {
			// given
			mockBoardsList.pop()

			// then
			return columns.getByName({}, 'column').should.be.rejectedWith('No board found')
		})

		it('should throw if column does not exist', function () {
			// then
			return columns.getByName({}, 'unknown').should.be.rejectedWith('No board column found with name "unknown"')
		})

		it('should filter board and return column', async function () {
			// given
			const options = {a: 1}

			// when
			const res = await columns.getByName(options, 'column')

			// then
			mockBoards.getAll.should.have.been.calledWith(options)
			res.should.eql(mockBoardsList[0].columns[0])
		})
	})
})
