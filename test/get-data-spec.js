'use strict'

const basicAuth = require('basic-auth')
const MockServer = require('mock-http-server')
const proxyquire = require('proxyquire')

describe('Get data', function () {
	const server = new MockServer({host: 'localhost', port: 0})
	const mockObjects = ['object1', 'object2']
	const mockOptions = {
		projectid: 'projectid',
		email: 'email',
		apikey: 'apikey'
	}
	let getData
	let url
  
	beforeEach(function (done) {
		server.start(() => {
			url = `http://localhost:${server.getHttpPort()}`
			getData = proxyquire('../src/get-data', {
				'./config.json': {url}
			})
			done()
		})
	})

	afterEach(function (done) {
		server.stop(done)
	})

	describe('#getData', function () {
		it('should call API with provided data and return response', async function () {
			// given
			const mockRes = {objects: []}
			server.on({
				method: 'POST',
				path: '/getData',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
	
			// when
			const res = await getData.getData(mockOptions, ...mockObjects)
	
			// then
			res.should.eql(mockRes)
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: mockOptions.email,
				pass: mockOptions.apikey
			})
			req.body.should.eql({
				projectIDs: mockOptions.projectid,
				includeProperties: mockObjects.join(',')
			})
		})
	})

	describe('#getDataVersion', function () {
		it('should call API with provided data and return response', async function () {
			// given
			const mockRes = {objects: []}
			server.on({
				method: 'POST',
				path: '/getDataVersion',
				reply: {
					status: 200,
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(mockRes)
				}
			})
	
			// when
			const res = await getData.getDataVersion(mockOptions)
	
			// then
			res.should.eql(mockRes)
			const req = server.requests()[0]
			basicAuth.parse(req.headers['authorization']).should.eql({
				name: mockOptions.email,
				pass: mockOptions.apikey
			})
			req.body.should.eql({})
		})
	})
})
