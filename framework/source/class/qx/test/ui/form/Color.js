/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
qx.Class.define("qx.test.ui.form.Color",
{
  extend : qx.test.ui.LayoutTestCase,

  members :
  {
    __test: function(widget) {
      // check if the interface is implemented
      this.assertTrue(qx.Class.hasInterface(widget.constructor, qx.ui.form.IColorForm), "Interface is not implemented.");
      
      // just check if the method is available
      widget.resetValue();
      
      // check the getter and setter
      widget.setValue("green");
      this.assertEquals("green", widget.getValue(), "Set or get does not work.");
      
      var self = this;
      this.assertEventFired(widget, "changeValue", function() {
        widget.setValue("blue");
      }, function(e) {
        self.assertEquals("blue", e.getData(), "Wrong data in the event.");
        self.assertEquals("green", e.getOldData(), "Wrong old data in the event.");
      }, "Event is wrong!");      
    },
    
    testColorPopup: function() {
     this.__test(new qx.ui.control.ColorSelector()); 
    },
    
    testColorSelector: function() {
     this.__test(new qx.ui.control.ColorPopup()); 
    }
    
  }
});