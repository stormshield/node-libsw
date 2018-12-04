'use strict'

const basicAuth = require('basic-auth')
const MockServer = require('mock-http-server')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Tags', function () {
  const server = new MockServer({host: 'localhost', port: 0})
  let mockTags
  let mockGetData
  let tags
  let url

  beforeEach(function (done) {
    mockTags = [{
      name: 'OK'
    }]
    mockGetData = {
      TAGS: 'tags',
      getData: sinon.stub().resolves({result: {projects: [{tags: mockTags}]}})
    }
    server.start(() => {
      url = `http://localhost:${server.getHttpPort()}`
      tags = proxyquire('../src/tags', {
        './config.json': {url},
        './get-data': mockGetData
      })
      done()
    })
  })

  afterEach(function (done) {
    server.stop(done)
  })

  describe('#addTagOnObject', function() {
    let mockRes

    beforeEach(function () {
      mockRes = {result: {}}
      server.on({
        method: 'POST',
        path: '/addTagOnObject',
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
      const tagId = 'tagid'
      const objectType = 'objectType'
      const objectId = 'objectId'

      // when
      const res = await tags.addTagOnObject(options, tagId, objectType, objectId)

      // then
      res.should.eql(mockRes)
      const req = server.requests()[0]
      basicAuth.parse(req.headers['authorization']).should.eql({
        name: options.email,
        pass: options.apikey
      })
      req.body.should.eql({
        tagID: tagId,
        objectType,
        objectID: objectId
      })
    })
  })

  describe('#getAll', function () {
    it('should pass options to getData', async function () {
      // given
      const options = {a: 1}

      // when
      await tags.getAll(options)

      // then
      mockGetData.getData.should.have.been.calledWith(options)
    })

    it('should pass TAGS object to getData', async function () {
      // when
      await tags.getAll({})

      // then
      mockGetData.getData.should.have.been.calledWith({}, mockGetData.TAGS)
    })

    it('should return all tags', async function () {
      // when
      const res = await tags.getAll({})

      // then
      res.should.eql(mockTags)
    })
  })

  describe('#getById', function () {
    it('should throw if tag does not exist', function () {
      // then
      return tags.getById({}, 'unknown').should.be.rejectedWith('No tag found with id "unknown"')
    })

    it('should return filtered tag', async function () {
      // given
      const tag = {id: 'filter'}
      mockTags.push(tag)

      // when
      const res = await tags.getById({}, 'filter')

      // then
      res.should.eql(tag)
    })
  })

  describe('#getByName', function () {
    it('should throw if tag does not exist', function () {
      // then
      return tags.getByName({}, 'unknown').should.be.rejectedWith('No tag found with name "unknown"')
    })

    it('should return filtered tag', async function () {
      // given
      const tag = {name: 'filter'}
      mockTags.push(tag)

      // when
      const res = await tags.getByName({}, 'filter')

      // then
      res.should.eql(tag)
    })
  })

  describe('#removeTagFromObject', function () {
    let mockRes

    beforeEach(function () {
      mockRes = {result: {}}
      server.on({
        method: 'POST',
        path: '/removeTagFromObject',
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
      const tagId = 'tagid'
      const objectType = 'objectType'
      const objectId = 'objectId'

      // when
      const res = await tags.removeTagFromObject(options, tagId, objectType, objectId)

      // then
      res.should.eql(mockRes)
      const req = server.requests()[0]
      basicAuth.parse(req.headers['authorization']).should.eql({
        name: options.email,
        pass: options.apikey
      })
      req.body.should.eql({
        tagID: tagId,
        objectType,
        objectID: objectId
      })
    })
  })
})
