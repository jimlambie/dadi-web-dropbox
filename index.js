'use strict'

const path = require('path')
const request = require('request')
const promise = Promise
const purest = require('purest')({ request, promise })
const purestConfig = require('@purest/providers')

//const config = require(path.join(__dirname, '/../../../config.js'))
//const DatasourceCache = require(path.join(__dirname, '/../cache/datasource'))

const DropboxProvider = function () {
  this.endpoint = 'files/list_folder'
  this.accessToken = process.env['DROPBOX_ACCESS_TOKEN']
}

/**
 * initialise - initialises the datasource provider
 *
 * @param  {obj} datasource - the datasource to which this provider belongs
 * @param  {obj} schema - the schema that this provider works with
 * @return {void}
 */
DropboxProvider.prototype.initialise = function (datasource, schema) {
  this.datasource = datasource
  this.schema = schema
  this.setAuthStrategy()
  this.dropboxApi = purest({
    provider: 'dropbox',
    config: purestConfig,
    version: 2,
    auth: this.accessToken
  })
}

/**
 * Build the request body for the list_folder API call
 *
 * @return {obj} request body to pass to the Dropbox api
 */
DropboxProvider.prototype.buildQueryParams = function () {
  const datasource = this.schema.datasource
  let params = {
    path: datasource.source.path
  }

  return params
}

/**
 * load
 *
 * @param  {string} requestUrl - url of the web request (not used)
 * @param  {fn} done - callback on error or completion
 * @return {void}
 */
DropboxProvider.prototype.load = function (requestUrl, done) {
  try {
    const path = this.schema.datasource.source.path
    const queryParams = this.buildQueryParams()

    this.cacheKey = [
      path,
      encodeURIComponent(JSON.stringify(this.schema.datasource))
    ].join('+')

    // this.dataCache = new DatasourceCache()

    // var cacheOptions = {
    //   name: this.datasource.name,
    //   caching: this.schema.datasource.caching,
    //   cacheKey: this.cacheKey
    // }

    // this.dataCache.getFromCache(cacheOptions, cachedData => {
    //   if (cachedData) {
    //     try {
    //       cachedData = JSON.parse(cachedData.toString())
    //       return done(null, cachedData)
    //     } catch (err) {
    //       console.error(
    //         'Twitter: cache data incomplete, making HTTP request: ' +
    //           err +
    //           '(' +
    //           cacheOptions.cacheKey +
    //           ')'
    //       )
    //     }
    //   }

    this.dropboxApi
      .post(this.endpoint)
      .auth(this.accessToken)
      .body(queryParams)
      .request()
      .then(result => {
        this.processOutput(result[0], result[1], done)
      })
      .catch(err => done(err, null))
    // })
  } catch (ex) {
    done(ex, null)
  }
}

/**
 * processOutput
 *
 * @param  {response} res
 * @param  {string} data
 * @param  {fn} done
 * @return {void}
 */
DropboxProvider.prototype.processOutput = function (res, data, done) {
  // if the error is anything other than Success or Bad Request, error
  if (res.statusCode && res.statusCode !== 200) {
    const err = new Error()
    const info = `${res.statusMessage} (${res.statusCode}): ${this.endpoint}`

    err.message = `Datasource "${this.datasource.name}" failed. ${info}`
    if (data) err.message += '\n' + data

    return done(err)
  }

  if (res.statusCode === 200) {
    data = this.processFields(data.entries)

    // var cacheOptions = {
    //   name: this.datasource.name,
    //   caching: this.schema.datasource.caching,
    //   cacheKey: this.cacheKey
    // }
    //
    // this.dataCache.cacheResponse(cacheOptions, JSON.stringify(data), () => {
    //   //
    // })
  }

  return done(null, data)
}

/**
 * processFields - remove any unwanted fields from the dataset
 *
 * @param  {obj} data before it's been processed
 * @return {obj} data after it's been processed
 */
DropboxProvider.prototype.processFields = function (data) {
  let fields = this.schema.datasource.fields

  if (fields && !Array.isArray(fields) && Object.keys(fields).length) {
    fields = Object.keys(fields)
  }

  if (!Array.isArray(data)) {
    data = [data]
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = this.pick(data[i], fields)
  }

  return data
}

DropboxProvider.prototype.pick = function (obj, fields) {
  const filtered = fields.reduce((result, key) => {
    result[key] = obj[key]
    return result
  }, {})

  return filtered
}

/**
 * processRequest - called on every request, rebuild buildEndpoint
 *
 * @param  {obj} req - web request object
 * @return {void}
 */
DropboxProvider.prototype.processRequest = function (req) {
  // not used
}

/**
 * setAuthStrategy
 *
 * @return {void}
 */
DropboxProvider.prototype.setAuthStrategy = function () {
  const auth = this.schema.datasource.auth

  // this.consumerKey =
  //   (auth && auth.consumer_key) || config.get('twitter.consumerKey')
  // this.consumerSecret =
  //   (auth && auth.consumer_secret) || config.get('twitter.consumerSecret')
  // this.accessTokenKey =
  //   (auth && auth.access_token_key) || config.get('twitter.accessTokenKey')
  // this.accessTokenSecret =
  //   (auth && auth.access_token_secret) ||
  //   config.get('twitter.accessTokenSecret')
}

module.exports = DropboxProvider
