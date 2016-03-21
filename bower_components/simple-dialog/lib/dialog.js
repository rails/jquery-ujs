(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-dialog', ["jquery","simple-module"], function (a0,b1) {
      return (root['dialog'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['dialog'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Dialog, dialog,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Dialog = (function(superClass) {
  extend(Dialog, superClass);

  function Dialog() {
    return Dialog.__super__.constructor.apply(this, arguments);
  }

  Dialog.i18n = {
    'zh-CN': {
      cancel: '取消',
      close: '关闭',
      ok: '确定',
      known: '知道了'
    },
    'en': {
      cancel: 'cancel',
      close: 'close',
      ok: 'ok',
      known: 'ok'
    }
  };

  Dialog.prototype.opts = {
    content: null,
    width: 450,
    modal: false,
    fullscreen: false,
    clickModalRemove: true,
    cls: "",
    showRemoveButton: true,
    buttons: ['close'],
    focusButton: ".btn:first",
    titleSelector: 'h3:first',
    contentSelector: '.simple-dialog-content',
    buttonSelector: '.simple-dialog-buttons'
  };

  Dialog._count = 0;

  Dialog._mobile = (function() {
    var ua;
    ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/.test(ua);
  })();

  Dialog._tpl = {
    dialog: "<div class=\"simple-dialog\">\n  <div class=\"simple-dialog-wrapper\">\n    <div class=\"simple-dialog-content\"></div>\n    <div class=\"simple-dialog-buttons\"></div>\n  </div>\n  <a class=\"simple-dialog-remove\" href=\"javascript:;\">\n    <i class=\"icon-cross\"><span>&#10005;</span></i>\n  </a>\n</div>",
    modal: "<div class=\"simple-dialog-modal\"></div>",
    button: "<button type=\"button\"></button>"
  };

  Dialog.prototype._init = function() {
    if (this.opts.content === null) {
      throw new Error("[Dialog] - content shouldn't be empty");
    }
    this.id = ++Dialog._count;
    Dialog.removeAll();
    this._render();
    this._bind();
    this.el.data("dialog", this);
    this.refresh();
    if (this.opts.buttons && this.opts.focusButton) {
      return this.buttonWrap.find(this.opts.focusButton).focus();
    }
  };

  Dialog.prototype._render = function() {
    var button, i, len, ref;
    this.el = $(Dialog._tpl.dialog).addClass(this.opts.cls);
    this.wrapper = this.el.find(".simple-dialog-wrapper");
    this.removeButton = this.el.find(".simple-dialog-remove");
    this.contentWrap = this.el.find(".simple-dialog-content");
    this.buttonWrap = this.el.find(".simple-dialog-buttons");
    this.el.toggleClass('simple-dialog-fullscreen', this.opts.fullscreen);
    this.el.css({
      width: this.opts.width
    });
    this.contentWrap.append(this.opts.content);
    if (!this.opts.showRemoveButton) {
      this.removeButton.remove();
    }
    if (!this.opts.buttons) {
      this.buttonWrap.remove();
      this.buttonWrap = null;
    } else {
      ref = this.opts.buttons;
      for (i = 0, len = ref.length; i < len; i++) {
        button = ref[i];
        if (button === "close") {
          button = {
            callback: (function(_this) {
              return function() {
                return _this.remove();
              };
            })(this)
          };
        }
        button = $.extend({}, Dialog.defaultButton, button);
        $(Dialog._tpl.button).addClass('btn').addClass(button.cls).html(button.text).on("click", button.callback).appendTo(this.buttonWrap);
      }
    }
    this.el.appendTo("body");
    if (this.opts.modal) {
      this.modal = $(Dialog._tpl.modal).appendTo("body");
      if (!this.opts.clickModalRemove) {
        return this.modal.css("cursor", "default");
      }
    }
  };

  Dialog.prototype._bind = function() {
    this.removeButton.on("click.simple-dialog", (function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.remove();
      };
    })(this));
    if (this.modal && this.opts.clickModalRemove) {
      this.modal.on("click.simple-dialog", (function(_this) {
        return function(e) {
          return _this.remove();
        };
      })(this));
    }
    $(document).on("keydown.simple-dialog-" + this.id, (function(_this) {
      return function(e) {
        if (e.which === 27) {
          return _this.remove();
        }
      };
    })(this));
    return $(window).on("resize.simple-dialog-" + this.id, (function(_this) {
      return function(e) {
        _this.maxContentHeight = null;
        return _this.refresh();
      };
    })(this));
  };

  Dialog.prototype._unbind = function() {
    this.removeButton.off(".simple-dialog");
    if (this.modal && this.opts.clickModalRemove) {
      this.modal.off(".simple-dialog");
    }
    $(document).off(".simple-dialog-" + this.id);
    return $(window).off(".simple-dialog-" + this.id);
  };

  Dialog.prototype._initContentScroll = function() {
    var contentPosition, contentW, innerHeight, scrollHeight, shadowH;
    this._topShadow || (this._topShadow = (function(_this) {
      return function() {
        return $('<div class="content-top-shadow" />').appendTo(_this.wrapper);
      };
    })(this)());
    this._bottomShadow || (this._bottomShadow = (function(_this) {
      return function() {
        return $('<div class="content-bottom-shadow" />').appendTo(_this.wrapper);
      };
    })(this)());
    contentPosition = this.contentEl.position();
    contentW = this.contentEl.width();
    shadowH = this._bottomShadow.height();
    this._topShadow.css({
      width: contentW,
      top: contentPosition.top,
      left: contentPosition.left
    });
    this._bottomShadow.css({
      width: contentW,
      top: contentPosition.top + this.contentEl.innerHeight() - shadowH,
      left: contentPosition.left
    });
    this.contentEl.css({
      'overflow-y': 'auto'
    }).css('position', 'relative');
    scrollHeight = this.contentEl[0].scrollHeight;
    innerHeight = this.contentEl.innerHeight();
    return this.contentEl.off('scroll.simple-dialog').on('scroll.simple-dialog', (function(_this) {
      return function(e) {
        var bottomScrolling, scrollTop, topScrolling;
        scrollTop = _this.contentEl.scrollTop();
        topScrolling = scrollTop > 0;
        bottomScrolling = scrollHeight - scrollTop - innerHeight > 1;
        return _this.wrapper.toggleClass('top-scrolling', topScrolling).toggleClass('bottom-scrolling', bottomScrolling);
      };
    })(this)).trigger('scroll');
  };

  Dialog.prototype.setContent = function(content) {
    this.contentWrap.html(content);
    this.contentEl = null;
    this.titleEl = null;
    this.buttonEl = null;
    this.maxContentHeight = null;
    this._topShadow = null;
    this._bottomShadow = null;
    return this.refresh();
  };

  Dialog.prototype.remove = function() {
    this.trigger('destroy');
    this._unbind();
    if (this.modal) {
      this.modal.remove();
    }
    this.el.remove();
    return $('body').removeClass('simple-dialog-scrollable');
  };

  Dialog.prototype.refresh = function() {
    var contentH;
    this.contentEl || (this.contentEl = this.el.find("" + this.opts.contentSelector));
    this.titleEl || (this.titleEl = this.el.find("" + this.opts.titleSelector));
    this.buttonEl || (this.buttonEl = this.el.find("" + this.opts.buttonSelector));
    this.maxContentHeight || (this.maxContentHeight = (function(_this) {
      return function() {
        var buttonH, dialogMargin, dialogPadding, ref, titleH, winH, wrapperPadding;
        winH = $(window).height();
        dialogMargin = _this.opts.fullscreen ? 0 : 30 * 2;
        dialogPadding = _this.el.outerHeight() - _this.el.height();
        wrapperPadding = _this.wrapper.outerHeight() - _this.wrapper.height();
        titleH = $.contains(_this.contentEl[0], _this.titleEl[0]) ? 0 : _this.titleEl.outerHeight(true);
        buttonH = _this.buttonEl && $.contains(_this.contentEl[0], _this.buttonEl[0]) ? 0 : ((ref = _this.buttonEl) != null ? ref.outerHeight(true) : void 0) || 0;
        return winH - dialogMargin - dialogPadding - wrapperPadding - titleH - buttonH;
      };
    })(this)());
    this.contentEl.css('height', '');
    contentH = this.contentEl[0].scrollHeight;
    if (contentH > this.maxContentHeight) {
      this.contentEl.height(this.maxContentHeight);
      $('body').addClass('simple-dialog-scrollable');
      this._initContentScroll();
    } else {
      this.contentEl.height(contentH);
      $('body').removeClass('simple-dialog-scrollable');
      this.wrapper.removeClass('top-scrolling bottom-scrolling');
    }
    return this.el.css({
      marginLeft: -this.el.outerWidth() / 2,
      marginTop: -this.el.outerHeight() / 2
    });
  };

  Dialog.removeAll = function() {
    return $(".simple-dialog").each(function() {
      var dialog;
      dialog = $(this).data("dialog");
      return dialog.remove();
    });
  };

  Dialog.defaultButton = {
    text: Dialog.prototype._t('close'),
    callback: $.noop
  };

  return Dialog;

})(SimpleModule);

dialog = function(opts) {
  return new Dialog(opts);
};

dialog["class"] = Dialog;

dialog.message = function(opts) {
  opts = $.extend({
    cls: "simple-dialog-message",
    buttons: [
      {
        text: Dialog._t('known'),
        callback: function(e) {
          return $(e.target).closest(".simple-dialog").data("dialog").remove();
        }
      }
    ]
  }, opts, {
    cls: "simple-dialog-message" + (opts.cls ? " " + opts.cls : '')
  });
  return new Dialog(opts);
};

dialog.confirm = function(opts) {
  opts = $.extend({
    callback: $.noop,
    cls: "simple-dialog-confirm",
    buttons: [
      {
        text: Dialog._t('ok'),
        callback: function(e) {
          dialog = $(e.target).closest(".simple-dialog").data("dialog");
          dialog.opts.callback(e, true);
          return dialog.remove();
        }
      }, {
        text: Dialog._t('cancel'),
        cls: "btn-link",
        callback: function(e) {
          dialog = $(e.target).closest(".simple-dialog").data("dialog");
          dialog.opts.callback(e, false);
          return dialog.remove();
        }
      }
    ]
  }, opts, {
    cls: "simple-dialog-confirm" + (opts.cls ? " " + opts.cls : '')
  });
  return new Dialog(opts);
};

dialog.removeAll = Dialog.removeAll;

dialog.setDefaultButton = function(opts) {
  return Dialog.defaultButton = opts;
};

return dialog;

}));
