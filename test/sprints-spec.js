'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Sprints', function () {
	let mockSprints
	let mockGetData
	let sprints

	beforeEach(function () {
		mockSprints = [{
			name: 'sprint-1'
		}]
		mockGetData = {
			SPRINTS: 'sprints',
			getData: sinon.stub().resolves({result: {projects: [{sprints: mockSprints}]}})
		}
		sprints = proxyquire('../src/sprints', {
			'./get-data': mockGetData
		})
	})

	describe('#getAll', function () {

		it('should pass options to getData', async function () {
			// given
			const options = {a: 1}

			// when
			await sprints.getAll(options)

			// then
			mockGetData.getData.should.have.been.calledWith(options)
		})

		it('should pass SPRINTS object to getData', async function () {
			// when
			await sprints.getAll({})

			// then
			mockGetData.getData.should.have.been.calledWith({}, mockGetData.SPRINTS)
		})

		it('should return all sprints', async function () {
			// when
			const res = await sprints.getAll({})

			// then
			res.should.eql(mockSprints)
		})

	})

	describe('#getOne', function () {

		it('should return undefined if sprint does not exist', function () {
			//
			return sprints.getOne({}, {id: 'unknown'}).should.eventually.be.undefined
		})

		it('should return filtered sprint', async function () {
			// given
			const sprint = {id: 'filter'}
			mockSprints.push(sprint)

			// when
			const res = await sprints.getOne({}, {id: 'filter'})

			// then
			res.should.eql(sprint)
		})

	})

	describe('#getById', function () {

		it('should throw if sprint does not exist', function () {
			// then
			return sprints.getById({}, 'unknown').should.be.rejectedWith('No sprint found with id "unknown"')
		})

		it('should return filtered sprint', async function () {
			// given
			const sprint = {id: 'filter'}
			mockSprints.push(sprint)

			// when
			const res = await sprints.getById({}, 'filter')

			// then
			res.should.eql(sprint)
		})

	})

	describe('#getByName', function () {

		it('should throw if sprint does not exist', function () {
			// then
			return sprints.getByName({}, 'unknown').should.be.rejectedWith('No sprint found with name "unknown"')
		})

		it('should return filtered sprint', async function () {
			// given
			const sprint = {name: 'filter'}
			mockSprints.push(sprint)

			// when
			const res = await sprints.getByName({}, 'filter')

			// then
			res.should.eql(sprint)
		})

	})

})
