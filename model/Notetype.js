var _ = require('underscore')
var model = require('./')
var mongoose = require('mongoose')
var plugin = require('./plugin')

var Notetype = mongoose.Schema({
  name: { type: String, required: true },
  singularName: String,
  shortDesc: String,
  desc: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  slug: model.SLUG
})

Notetype.index({ courseId: 1, slug: 1 }, { unique: true })
Notetype.index({ courseId: 1 })

Notetype.virtual('searchDesc').get(function () {
  var notetype = this
  var course = _.find(app.cache.courses, function (c) {
    return c._id == notetype.courseId.toString()
  })
  if (!course) return ''
  return course.name + ' Notes'
})

Notetype.virtual('url').get(function() {
  var notetype = this
  var course = _.find(app.cache.courses, function (c) {
    return c._id == notetype.courseId.toString()
  })
  if (!course) return ''
  return '/' + course.slug + '/' + notetype.slug + '/'
})

Notetype.plugin(plugin.modifyDate)
Notetype.plugin(plugin.createDate)
Notetype.plugin(plugin.slug, { model: 'Notetype' })
Notetype.plugin(plugin.absoluteUrl)
Notetype.plugin(plugin.hits, { index: true })

module.exports = mongoose.model('Notetype', Notetype)