'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Backlog items', function () {
	let mockBacklogItems
	let mockGetData
	let backlogItems

	beforeEach(function () {
		mockBacklogItems = [{
			name: 'backlog-item-1'
		}]
		mockGetData = {
			BACKLOG_ITEMS: 'backlogItems',
			TASKS: 'tasks',
			getData: sinon.stub().resolves({result: {projects: [{backlogItems: mockBacklogItems}]}})
		}
		backlogItems = proxyquire('../src/backlog-items', {
			'./get-data': mockGetData
		})
	})

	describe('#getAll', function () {

		it('should pass options to getData', async function () {
			// given
			const options = {a: 1}

			// when
			await backlogItems.getAll(options)

			// then
			mockGetData.getData.should.have.been.calledWith(options)
		})

		it('should pass BACKLOG_ITEMS object to getData', async function () {
			// when
			await backlogItems.getAll({})

			// then
			mockGetData.getData.should.have.been.calledWith({}, mockGetData.BACKLOG_ITEMS)
		})

		it('should pass TASKS object to getData when getTasks option is set', async function () {
			// given
			const options = {getTasks: true}
      
			// when
			await backlogItems.getAll(options)

			// then
			mockGetData.getData.should.have.been.calledWith(options, mockGetData.BACKLOG_ITEMS, mockGetData.TASKS)
		})

		it('should return all backlog items', async function () {
			// when
			const res = await backlogItems.getAll({})

			// then
			res.should.eql(mockBacklogItems)
		})

		it('should filter on children backlog items', async function () {
			// given
			const childBI = {name: 'child'}
			mockBacklogItems.push({
				name: 'parent1',
				childBacklogItems: [
					childBI,
					{
						name: 'parent2',
						childBacklogItems: [childBI]
					}
				]
			})

			// when
			const res = await backlogItems.getAll({}, {name: 'child'})

			// then
			res.should.eql([childBI, childBI])
		})

	})

	describe('#getOne', function () {

		it('should return undefined if backlog item does not exist', function () {
			//
			return backlogItems.getOne({}, {id: 'unknown'}).should.eventually.be.undefined
		})

		it('should return filtered backlog item', async function () {
			// given
			const bi = {id: 'filter'}
			mockBacklogItems.push(bi)

			// when
			const res = await backlogItems.getOne({}, {id: 'filter'})

			// then
			res.should.eql(bi)
		})

	})

	describe('#getById', function () {

		it('should throw if backlog item does not exist', function () {
			// then
			return backlogItems.getById({}, 'unknown').should.be.rejectedWith('No backlog item found with id "unknown"')
		})

		it('should return filtered backlog item', async function () {
			// given
			const bi = {id: 'filter'}
			mockBacklogItems.push(bi)

			// when
			const res = await backlogItems.getById({}, 'filter')

			// then
			res.should.eql(bi)
		})

	})

	describe('#getByItemNumber', function () {

		it('should throw if backlog item does not exist', function () {
			// then
			return backlogItems.getByItemNumber({}, 'unknown').should.be.rejectedWith('No backlog item found with number "unknown"')
		})

		it('should return filtered backlog item', async function () {
			// given
			const bi = {itemNumber: 'filter'}
			mockBacklogItems.push(bi)

			// when
			const res = await backlogItems.getByItemNumber({}, 'filter')

			// then
			res.should.eql(bi)
		})

	})

	describe('#getByTeamIdAndSprintId', function () {

		it('should throw if no backlog item is assigned to sprint and team', function () {
			// then
			return backlogItems.getByTeamIdAndSprintId({}, 'team', 'sprint').should.be.rejectedWith('No backlog item assigned to team with id "team" and to sprint with id "sprint"')
		})

		it('should return filtered backlog items', async function () {
			// given
			const bi = {teamID: 'team', sprintID: 'sprint'}
			const bis = [bi, bi]
			mockBacklogItems.push(...bis)

			// when
			const res = await backlogItems.getByTeamIdAndSprintId({}, 'team', 'sprint')

			// then
			res.should.eql(bis)
		})

	})

})
