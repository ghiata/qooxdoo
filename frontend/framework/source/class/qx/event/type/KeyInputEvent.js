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
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#module(event)

************************************************************************ */

/**
 * Keyboard input event object.
 *
 * the interface of this class is based on the DOM Level 3 keyboard event
 * interface: http://www.w3.org/TR/DOM-Level-3-Events/events.html#Events-KeyboardEvent
 */
qx.Class.define("qx.event.type.KeyInputEvent",
{
  extend : qx.event.type.DomEvent,




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Initialize the fileds of the event.
     *
     * @type member
     * @param domEvent {Event} DOM event
     * @param charCode {Integer} the character code
     * @return {qx.event.type.KeyEvent} The initialized key event instance
     */
    init : function(domEvent, charCode)
    {
      this.base(arguments, domEvent);

      this._charCode = charCode;
      this._type = "keyinput";

      return this;
    },

    // overridden
    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    clone : function()
    {
      var clone = this.base(arguments);

      clone._charCode = this._charCode;

      return clone;
    },


    /**
     * Unicode number of the pressed character.
     *
     * @type member
     * @return {Integer} Unicode number of the pressed character
     */
    getCharCode : function() {
      return this._charCode;
    }
  }
});
