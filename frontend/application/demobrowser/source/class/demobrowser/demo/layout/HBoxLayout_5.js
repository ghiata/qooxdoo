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
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Class.define("demobrowser.demo.layout.HBoxLayout_5",
{
  extend : qx.application.Standalone,

  members :
  {
    main: function()
    {
      this.base(arguments);

      // one percent child which is not flexible
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({width: 500, decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, { width: "50%" });
      container.add(w2, { flex : 1 });
      container.add(w3, { flex : 1 });

      this.getRoot().add(container, {left:10, top:10});




      // all percent child, using 90% in sum, rest filled via flex
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({width: 500, decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "30%", flex: 1});
      container.add(w2, {width: "30%", flex: 1});
      container.add(w3, {width: "30%", flex: 1});

      this.getRoot().add(container, {left:10, top:70});




      // all percent child, using 99.9% in sum, flex disabled (=> to small result)
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({width: 500, decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "33.3%"});
      container.add(w2, {width: "33.3%"});
      container.add(w3, {width: "33.3%"});

      this.getRoot().add(container, {left:10, top:130});




      // all percent child, using 99.9% in sum, flex enabled for last child (=> perfect result, last one a bit bigger)
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({width: 500, decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "33.3%"});
      container.add(w2, {width: "33.3%"});
      container.add(w3, {width: "33.3%", flex : 1});

      this.getRoot().add(container, {left:10, top:190});






      // one percent child which is not flexible + auto sizing
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "50%"});
      container.add(w2, {flex: 1});
      container.add(w3, {flex: 1});

      this.getRoot().add(container, {left:10, top:250});



      // all child in percents + auto sizing + no flex
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "33.3%"});
      container.add(w2, {width: "33.3%"});
      container.add(w3, {width: "33.3%"});

      this.getRoot().add(container, {left:10, top:310});


      // all child in percents + auto sizing + flex enabled
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "33%", flex: 1});
      container.add(w2, {width: "33%", flex: 1});
      container.add(w3, {width: "33%", flex: 1});

      this.getRoot().add(container, {left:10, top:370});




      // all child in percents + flex enabled (shrinking)
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({width : 200, decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "33%", flex: 1});
      container.add(w2, {width: "33%", flex: 1});
      container.add(w3, {width: "33%", flex: 1});

      this.getRoot().add(container, {left:10, top:430});





      // all child in percents + flex enabled (growing)
      var box = new qx.ui.layout.HBox();
      var container = (new qx.ui.core.Composite(box)).set({width : 500, decorator: "black", backgroundColor: "yellow"});

      box.setSpacing(5);

      var w1 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w2 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      var w3 = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});

      container.add(w1, {width: "33%", flex: 1});
      container.add(w2, {width: "33%", flex: 1});
      container.add(w3, {width: "33%", flex: 1});

      this.getRoot().add(container, {left:10, top:490});
    }
  }
});
