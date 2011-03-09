qx.Bootstrap.define("qx.bom.client.CssFeatures", 
{
  statics :
  {
    getTextOverflow : function() {
      return "textOverflow" in document.documentElement.style ||
      "OTextOverflow" in document.documentElement.style;
    },


    getPlaceholder : function() {
      var i = document.createElement("input");
      return "placeholder" in i;
    },


    getBorderRadius : function() {
      return "borderRadius" in document.documentElement.style ||
      "MozBorderRadius" in document.documentElement.style || 
      "WebkitBorderRadius" in document.documentElement.style;
    },


    getBoxShadow : function() {
      return "BoxShadow" in document.documentElement.style ||
      "MozBoxShadow" in document.documentElement.style || 
      "WebkitBoxShadow" in document.documentElement.style;
    },
    
    
    getGradients : function() {
      var el;
      try {
        el = document.createElement("div");
      } catch (ex) {
        el = document.createElement();
      }

      var style = [
        "-webkit-gradient(linear,0% 0%,100% 100%,from(white), to(red))",
        "-moz-linear-gradient(0deg, white 0%, red 100%)",
        "-o-linear-gradient(0deg, white 0%, red 100%)",
        "linear-gradient(0deg, white 0%, red 100%)"
      ];
      
      for (var i=0; i < style.length; i++) {
        // try catch for IE
        try {
          el.style["background"] = style[i];
          if (el.style["background"].indexOf("gradient") != -1) {
            return true
          }
        } catch (ex) {}
      };

      return false;
    },


    getPointerEvents : function() {
      // Check if browser reports that pointerEvents is a known style property
      if ("pointerEvents" in document.documentElement.style) {
        // Opera 10.63 incorrectly advertises support for CSS pointer events (#4229).
        // Do not rely on pointer events in Opera until this browser issue is fixed.
        return qx.bom.client.Engine.getName() != "opera";
      }
    }
  }
});
