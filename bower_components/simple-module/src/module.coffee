class Module

  @extend: (obj) ->
    return unless obj? and typeof obj is 'object'
    for key, val of obj when key not in ['included', 'extended']
      @[key] = val
    obj.extended?.call(@)

  @include: (obj) ->
    return unless obj? and typeof obj is 'object'
    for key, val of obj when key not in ['included', 'extended']
      @::[key] = val
    obj.included?.call(@)

  @connect: (cls) ->
    return unless typeof cls is 'function'

    unless cls.pluginName
      throw new Error 'Module.connect: cannot connect plugin without pluginName'
      return

    cls::_connected = true
    @_connectedClasses = [] unless @_connectedClasses
    @_connectedClasses.push(cls)
    @[cls.pluginName] = cls if cls.pluginName


  opts: {}

  constructor: (opts) ->
    @opts = $.extend({}, @opts, opts)

    @constructor._connectedClasses ||= []

    instances = for cls in @constructor._connectedClasses
      name = cls.pluginName.charAt(0).toLowerCase() + cls.pluginName.slice(1)
      cls::_module = @ if cls::_connected
      @[name] = new cls()

    if @_connected
      @opts = $.extend {}, @opts, @_module.opts
    else
      @_init()
      instance._init?() for instance in instances

    @trigger 'initialized'

  _init: ->

  on: (args...) ->
    $(@).on args...
    @

  one: (args...) ->
    $(@).one args...
    @

  off: (args...) ->
    $(@).off args...
    @

  trigger: (args...) ->
    $(@).trigger args...
    @

  triggerHandler: (args...) ->
    $(@).triggerHandler args...

  _t: (args...) ->
    @constructor._t args...

  @_t: (key, args...) ->
    result = @i18n[@locale]?[key] || ''

    return result unless args.length > 0

    result = result.replace /([^%]|^)%(?:(\d+)\$)?s/g, (p0, p, position) ->
      if position
        p + args[parseInt(position) - 1]
      else
        p + args.shift()

    result.replace /%%s/g, '%s'

  @i18n:
    'zh-CN': {}

  @locale: 'zh-CN'


