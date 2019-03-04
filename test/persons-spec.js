'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Persons', function () {
	let mockDeletedPersons
	let mockPersons
	let mockGetData
	let persons

	beforeEach(function () {
		mockDeletedPersons = [{
			id: 'deleted-person'
		}]
		mockPersons = [{
			id: 'person'
		}]
		mockGetData = {
			DELETED_PERSONS: 'deletedPersons',
			PERSONS: 'persons',
			getData: sinon.stub().resolves({result: {
				deletedPersons: mockDeletedPersons,
				persons: mockPersons
			}})
		}
		persons = proxyquire('../src/persons', {
			'./get-data': mockGetData
		})
	})

	describe('#getAll', function () {

		it('should pass options to getData', async function () {
			// given
			const options = {a: 1}

			// when
			await persons.getAll(options)

			// then
			mockGetData.getData.should.have.been.calledWith(options)
		})

		it('should pass DELETED_PERSONS and PERSONS object to getData', async function () {
			// when
			await persons.getAll({})

			// then
			mockGetData.getData.should.have.been.calledWith({}, mockGetData.DELETED_PERSONS, mockGetData.PERSONS)
		})

		it('should return all sprints', async function () {
			// when
			const res = await persons.getAll({})

			// then
			res.should.eql([...mockDeletedPersons, ...mockPersons])
		})

	})
})
