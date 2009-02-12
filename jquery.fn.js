(function($) {
  $.fn.fn = function() {
    var self = this;
    var extension = arguments[0], name = arguments[0];
    if (typeof name == "string") {
      return apply(self, name, $.makeArray(arguments).slice(1, arguments.length));
    } else {
      $.each(extension, function(key, value) {
        define(self, key, value);
      });
      return self;
    }
  }
  
  $.effen = function(selector, fns) {
    $.effen.store[selector] = fns;
  }
  $.effen.store = {};
  
  function define(self, name, fn) {
    self.data(namespacedName(name), fn);
  };
  function apply(self, name, args) {
    var result;
    self.each(function(i, item) {
      var fn = $(item).data(namespacedName(name)) || liveFn(item, name);
      if (fn)
        result = fn.apply(item, args);
      else
        throw(name + " is not defined");
    });
    return result;
  };
  function namespacedName(name) {
    return 'fn.' + name;
  }
  function liveFn(item, name) {
    var fn;
    $.each($.effen.store, function(selector, fns) {
      // Filter out should and should_not, which jspec adds to Object's prototype.
      // This is a bad smell.
      if (selector == $.effen.store.should ||
          selector == $.effen.store.should_not)
        return true; // Skip.
      
      if ($(item).is(selector) && fns[name])
        fn = fns[name];
    });
    return fn;
  }
})(jQuery);