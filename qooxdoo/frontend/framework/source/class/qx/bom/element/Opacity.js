/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

   ======================================================================

   This class contains code based on the following work:

   * Prototype JS
     http://www.prototypejs.org/
     Version 1.5

     Copyright:
       (c) 2006-2007, Prototype Core Team

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

     Authors:
       * Prototype Core Team

************************************************************************ */

/* ************************************************************************

#module(bom)

************************************************************************ */

/**
 * Full blown cross-browser opacity support.
 *
 * Optimized for animations (contains workarounds for typical flickering
 * in some browsers). Reduced class dependencies for optimal size and
 * performance.
 */
qx.Class.define("qx.bom.element.Opacity",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Sets opacity of given element. Accepts numbers between zero and one
     * where "0" means transparent, "1" means opaque.
     *
     * @type static
     * @param element {Element} DOM element to modify
     * @param opacity {Float} A float number between 0 and 1
     * @return {void}
     * @signature function(element, opacity)
     */
    set : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(element, opacity)
      {
        // Read in computed filter
        var filter = qx.bom.element.Style.get(element, "filter", qx.bom.element.Style.COMPUTED_MODE, false);

        // Remove opacity filter
        if (opacity >= 1)
        {
          element.style.filter = filter.replace(/alpha\([^\)]*\)/gi, "");
          return;
        }

        if (opacity < 0.00001) {
          opacity = 0;
        }

        // IE has trouble with opacity if it does not have layout (hasLayout)
        // Force it by setting the zoom level
        if (!element.currentStyle.hasLayout) {
          element.style.zoom = 1;
        }

        // Remove old alpha filter and add new one
        element.style.filter = filter.replace(/alpha\([^\)]*\)/gi, "") + "alpha(opacity=" + opacity * 100 + ")";
      },

      "gecko" : function(element, opacity)
      {
        // Animations look better when not using 1.0 in gecko
        if (opacity == 1) {
          opacity = 0.999999;
        }

        if (qx.bom.client.Engine.VERSION < 1.7) {
          element.style.MozOpacity = opacity;
        } else {
          element.style.opacity = opacity;
        }
      },

      "default" : function(element, opacity)
      {
        if (opacity == 1) {
          opacity = "";
        }

        element.style.opacity = opacity;
      }
    }),


    /**
     * Resets opacity of given element.
     *
     * @type static
     * @param element {Element} DOM element to modify
     * @return {void}
     * @signature function(element)
     */
    reset : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(element)
      {
        // Read in computed filter
        var filter = qx.bom.element.Style.get(element, "filter", qx.bom.element.Style.COMPUTED_MODE, false);

        // Remove old alpha filter
        element.style.filter = filter.replace(/alpha\([^\)]*\)/gi, "");
      },

      "gecko" : function(element)
      {
        if (qx.bom.client.Engine.VERSION < 1.7) {
          element.style.MozOpacity = "";
        } else {
          element.style.opacity = "";
        }
      },

      "default" : function(element) {
        element.style.opacity = "";
      }
    }),


    /**
     * Gets computed opacity of given element. Accepts numbers between zero and one
     * where "0" means transparent, "1" means opaque.
     *
     * @type static
     * @param element {Element} DOM element to modify
     * @param mode {Number} Choose one of the modes {@link qx.bom.element.Style#COMPUTED_MODE},
     *   {@link qx.bom.element.Style#CASCADED_MODE}, {@link qx.bom.element.Style#LOCAL_MODE}.
     *   The computed mode is the default one.
     * @return {Float} A float number between 0 and 1
     * @signature function(element, mode)
     */
    get : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(element, mode)
      {
        var filter = qx.bom.element.Style.get(element, "filter", mode, false);

        if (filter)
        {
          var opacity = filter.match(/alpha\(opacity=(.*)\)/);

          if (opacity && opacity[1]) {
            return parseFloat(opacity[1]) / 100;
          }
        }

        return 1.0;
      },

      "gecko" : function(element, mode)
      {
        var opacity = qx.bom.element.Style.get(element, qx.bom.client.Engine.VERSION < 1.7 ? "MozOpacity" : "opacity", mode, false);

        if (opacity == 0.999999) {
          opacity = 1.0;
        }

        if (opacity != null) {
          return parseFloat(opacity);
        }

        return 1.0;
      },

      "default" : function(element, mode)
      {
        var opacity = qx.bom.element.Style.get(element, "opacity", mode, false);

        if (opacity != null) {
          return parseFloat(opacity);
        }

        return 1.0;
      }
    })
  }
});
