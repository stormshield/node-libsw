'use strict'

const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('Teams', function () {
  let mockTeams
  let mockGetData
  let teams

  beforeEach(function () {
    mockTeams = [{
      name: 'team-1'
    }]
    mockGetData = {
      TEAMS: 'teams',
      getData: sinon.stub().resolves({result: {projects: [{teams: mockTeams}]}})
    }
    teams = proxyquire('../src/teams', {
      './get-data': mockGetData
    })
  })

  describe('#getAll', function () {

    it('should pass options to getData', async function () {
      // given
      const options = {a: 1}

      // when
      await teams.getAll(options)

      // then
      mockGetData.getData.should.have.been.calledWith(options)
    })

    it('should pass TEAMS object to getData', async function () {
      // when
      await teams.getAll({})

      // then
      mockGetData.getData.should.have.been.calledWith({}, mockGetData.TEAMS)
    })

    it('should return all teams', async function () {
      // when
      const res = await teams.getAll({})

      // then
      res.should.eql(mockTeams)
    })

  })

  describe('#getOne', function () {

    it('should return undefined if team does not exist', function () {
      //
      return teams.getOne({}, {id: 'unknown'}).should.eventually.be.undefined
    })

    it('should return filtered team', async function () {
      // given
      const team = {id: 'filter'}
      mockTeams.push(team)

      // when
      const res = await teams.getOne({}, {id: 'filter'})

      // then
      res.should.eql(team)
    })

  })

  describe('#getById', function () {

    it('should throw if team does not exist', function () {
      // then
      return teams.getById({}, 'unknown').should.be.rejectedWith('No team found with id "unknown"')
    })

    it('should return filtered team', async function () {
      // given
      const team = {id: 'filter'}
      mockTeams.push(team)

      // when
      const res = await teams.getById({}, 'filter')

      // then
      res.should.eql(team)
    })

  })

  describe('#getByName', function () {

    it('should throw if team does not exist', function () {
      // then
      return teams.getByName({}, 'unknown').should.be.rejectedWith('No team found with name "unknown"')
    })

    it('should return filtered team', async function () {
      // given
      const team = {name: 'filter'}
      mockTeams.push(team)

      // when
      const res = await teams.getByName({}, 'filter')

      // then
      res.should.eql(team)
    })

  })

})
