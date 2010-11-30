/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * @tag noPlayground
 */
qx.Class.define("demobrowser.demo.virtual.GroupedList",
{
  extend : qx.application.Standalone,

  members :
  {
    __list : null,
    
    __listGroupedByName : null,
    
    __listGroupedByGroup : null,
  
    main: function()
    {
      this.base(arguments);

      var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(20)); 
      this.getRoot().add(container, {edge: 20});
      
      container.add(this.createFirtExample());
      container.add(this.createSecondExample());
      container.add(this.createThirdExample());
      
      this.loadData();
    },

    loadData : function()
    {
      var url = "json/persons.json";
      var store = new qx.data.store.Json(url);
      store.bind("model.persons", this.__list, "model");
      store.bind("model.persons", this.__listGroupedByName, "model");
      store.bind("model.persons", this.__listGroupedByGroup, "model");
    },
    
    createFirtExample : function()
    {
      var container = new qx.ui.container.Composite(new qx.ui.layout.Canvas());

      var title = new qx.ui.basic.Label("Raw List:").set({
        font: "bold"
      });
      container.add(title);

      var list = this.__list = new qx.ui.list.List().set({
        height: 280,
        width: 150,
        labelPath: "firstname",
        labelOptions: {converter: function(data, model) {
          return model ? data + " " + model.getLastname() : "no model...";
        }}
      });
      container.add(list, {top: 20});
      
      return container;
    },
    
    createSecondExample : function()
    {
      var container = new qx.ui.container.Composite(new qx.ui.layout.Canvas());

      var title = new qx.ui.basic.Label("Grouped by lastname:").set({
        font: "bold"
      });
      container.add(title);

      var list = this.__listGroupedByName = new qx.ui.list.List().set({
        height: 280,
        width: 150,
        labelPath: "firstname",
        labelOptions: {converter: function(data, model) {
          return model ? model.getLastname() + ", " + data : "no model...";
        }}
      });
      
      var delegate = {
        sorter : function(a, b)
        {
          a = a.getLastname();
          b = b.getLastname();
          
          return a > b ? 1 : a < b ? -1 : 0;
        },
          
        group : function(model) {
          return model.getLastname().charAt(0).toUpperCase();
        }
      };
      list.setDelegate(delegate);
      
      container.add(list, {top: 20});
      
      return container;
    },
    
    createThirdExample : function()
    {
      var container = new qx.ui.container.Composite(new qx.ui.layout.Canvas());

      var title = new qx.ui.basic.Label("Grouped by group:").set({
        font: "bold"
      });
      container.add(title);

      var list = this.__listGroupedByGroup = new qx.ui.list.List().set({
        height: 280,
        width: 150,
        labelPath: "firstname",
        labelOptions: {converter: function(data, model) {
          return model ? data + " " + model.getLastname() : "no model...";
        }}
      });
      
      var delegate = {
        sorter : function(a, b)
        {
          a = a.getLastname();
          b = b.getLastname();
          
          return a > b ? 1 : a < b ? -1 : 0;
        },
          
        group : function(model) {
          return model.getGroup();
        }
      };
      list.setDelegate(delegate);
      
      container.add(list, {top: 20});
      
      return container;
    }
  },
  
  destruct : function()
  {
    this.__model.dispose();
    this.__model = null;
  }
});