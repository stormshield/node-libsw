'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Boards', function () {
	let mockBoards
	let mockGetData
	let boards

	beforeEach(function () {
		mockBoards = [{
			name: 'board-1'
		}]
		mockGetData = {
			BOARDS: 'boards',
			BOARD_COLUMNS: 'columns',
			getData: sinon.stub().resolves({result: {projects: [{boards: mockBoards}]}})
		}
		boards = proxyquire('../src/boards', {
			'./get-data': mockGetData
		})
	})

	describe('#getAll', function () {

		it('should pass options to getData', async function () {
			// given
			const options = {a: 1}

			// when
			await boards.getAll(options)

			// then
			mockGetData.getData.should.have.been.calledWith(options)
		})

		it('should pass BOARDS object to getData', async function () {
			// when
			await boards.getAll({})

			// then
			mockGetData.getData.should.have.been.calledWith({}, mockGetData.BOARDS)
		})

		it('should return all boards', async function () {
			// when
			const res = await boards.getAll({})

			// then
			res.should.eql(mockBoards)
		})

	})

	describe('#getOne', function () {

		it('should return undefined if board does not exist', function () {
			//
			return boards.getOne({}, {id: 'unknown'}).should.eventually.be.undefined
		})

		it('should return filtered board', async function () {
			// given
			const board = {id: 'filter'}
			mockBoards.push(board)

			// when
			const res = await boards.getOne({}, {id: 'filter'})

			// then
			res.should.eql(board)
		})

	})

	describe('#getById', function () {

		it('should throw if board does not exist', function () {
			// then
			return boards.getById({}, 'unknown').should.be.rejectedWith('No board found with id "unknown"')
		})

		it('should return filtered board', async function () {
			// given
			const board = {id: 'filter'}
			mockBoards.push(board)

			// when
			const res = await boards.getById({}, 'filter')

			// then
			res.should.eql(board)
		})

	})

	describe('#getByName', function () {

		it('should throw if board does not exist', function () {
			// then
			return boards.getByName({}, 'unknown').should.be.rejectedWith('No board found with name "unknown"')
		})

		it('should return filtered board', async function () {
			// given
			const board = {name: 'filter'}
			mockBoards.push(board)

			// when
			const res = await boards.getByName({}, 'filter')

			// then
			res.should.eql(board)
		})

	})

})
