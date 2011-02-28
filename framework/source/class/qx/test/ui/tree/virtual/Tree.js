/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/* ************************************************************************

#ignore(qx.test.ui.tree.virtual.Leaf)
#ignore(qx.test.ui.tree.virtual.Node)

************************************************************************ */

qx.Class.define("qx.test.ui.tree.virtual.Tree",
{
  extend : qx.test.ui.LayoutTestCase,

  construct : function()
  {
    this.base(arguments);

    qx.Class.define("qx.test.ui.tree.virtual.Leaf",
    {
      extend : qx.core.Object,

      construct : function(name)
      {
        this.base(arguments);

        this.setName(name);
      },

      properties :
      {
        name :
        {
          check : "String",
          event : "changeName",
          nullable : true
        }
      }
    });

    qx.Class.define("qx.test.ui.tree.virtual.Node",
    {
      extend : qx.test.ui.tree.virtual.Leaf,
      include : qx.data.marshal.MEventBubbling,

      construct : function(name, children)
      {
        this.base(arguments, name);

        if (children == null) {
          children = new qx.data.Array();
        }
        this.setChildren(children);
      },

      properties :
      {
        children :
        {
          check : "qx.data.Array",
          event : "changeChildren",
          apply : "_applyEventPropagation",
          nullable : true
        }
      },

      destruct : function()
      {
        if (!qx.core.ObjectRegistry.inShutDown)
        {
          var children = this.getChildren();
          for (var i = 0; i  < children.getLength(); i++) {
            children.getItem(i).dispose();
          }
          children.dispose();
          this.setChildren(null);
        }
      }
    });
  },


  members :
  {
    tree : null,


    setUp : function()
    {
      this.base(arguments);

      this.tree = new qx.ui.tree.VirtualTree();
      this.getRoot().add(this.tree);
    },


    tearDown : function()
    {
      this.base(arguments);

      this.tree.dispose();
      this.tree = null;

      if (this.model != null) {
        this.model.dispose();
        this.model = null;
      }
    },


    createModel : function(level)
    {
      var root = new qx.test.ui.tree.virtual.Node("Root node");
      this.__createNodes(root, level);

      return root;
    },


    createModelAndSetModel : function(level)
    {
      this.model = this.createModel(level);
      this.tree.setLabelPath("name");
      this.tree.setChildProperty("children");
      this.tree.setModel(this.model);
      return this.model;
    },


    testCreation : function()
    {
      this.assertEquals("virtual-tree", this.tree.getAppearance(), "Init value for 'appearance' is wrong!");
      this.assertTrue(this.tree.getFocusable(), "Init value for 'focusable' is wrong!");
      this.assertEquals(100, this.tree.getWidth(), "Init value for 'width' is wrong!");
      this.assertEquals(200, this.tree.getHeight(), "Init value for 'height' is wrong!");
      this.assertEquals(25, this.tree.getItemHeight(), "Init value for 'itemHeight' is wrong!");
      this.assertEquals(25, this.tree.getPane().getRowConfig().getDefaultItemSize(), "Init value for 'itemHeight' is wrong!");
      this.assertEquals("dblclick", this.tree.getOpenMode(), "Init value for 'openMode' is wrong!");
      this.assertFalse(this.tree.getHideRoot(), "Init value for 'hideRoot' is wrong!");
      this.assertNull(this.tree.getModel(), "Init value for 'model' is wrong!");
      this.assertNull(this.tree.getLabelPath(), "Init value for 'labelPath' is wrong!");
      this.assertNull(this.tree.getIconPath(), "Init value for 'iconPath' is wrong!");
      this.assertNull(this.tree.getLabelOptions(), "Init value for 'labelOptions' is wrong!");
      this.assertNull(this.tree.getIconOptions(), "Init value for 'iconOptions' is wrong!");
      this.assertNull(this.tree.getDelegate(), "Init value for 'delegate' is wrong!");
      this.assertNull(this.tree.getChildProperty(), "Init value for 'childProperty' is wrong!");
      this.assertTrue(this.tree.getPane().hasListener("cellDblclick"), "Init listener 'cellDblclick' is wrong!");
    },


    testCreationWithParams : function()
    {
      this.tree.destroy();

      var model = this.createModel(0);
      this.tree = new qx.ui.tree.VirtualTree(model, "name", "children");
      this.getRoot().add(this.tree);

      this.assertEquals(model, this.tree.getModel(), "Init value for 'model' is wrong!");
      this.assertEquals("name", this.tree.getLabelPath(), "Init value for 'labelPath' is wrong!");
      this.assertEquals("children", this.tree.getChildProperty(), "Init value for 'childProperty' is wrong!");
    },


    testSetItemHeight : function()
    {
      this.tree.setItemHeight(30);
      this.assertEquals(30, this.tree.getPane().getRowConfig().getDefaultItemSize());
    },


    testSetModel : function()
    {
      var model = this.createModelAndSetModel(0);
      this.assertEquals(model, this.tree.getModel());
    },


    testResetModel : function()
    {
      var oldModel = this.tree.getModel();

      this.createModelAndSetModel(0);

      this.tree.resetModel();
      this.assertEquals(oldModel, this.tree.getModel());
    },


    testExceptionOnSetMode : function()
    {
      var model = this.createModel(0);

      var that = this;
      this.assertException(function() {
        that.tree.setModel(model);
      }, Error, "Could not build tree, because 'childProperty' and/or 'labelPath' is 'null'!");
    },


    testBuildLookupTable : function()
    {
      var root = this.createModelAndSetModel(2);

      var expected = this.__getVisibleItemsFrom(root, [root]);
      qx.lang.Array.insertAt(expected, root, 0);

      this.__testBuildLookupTable(expected);
    },


    testBuildLookupTableWithOpenNodes : function()
    {
      var root = this.createModelAndSetModel(3);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(4),
        root.getChildren().getItem(4).getChildren().getItem(2)
      ];
      this.__openNodes(nodesToOpen);

      var expected = this.__getVisibleItemsFrom(root, nodesToOpen);
      qx.lang.Array.insertAt(expected, root, 0);

      this.__testBuildLookupTable(expected);
    },


    testBuildLookupTableWithRemovedNodes : function()
    {
      var root = this.createModelAndSetModel(3);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(4),
        root.getChildren().getItem(4).getChildren().getItem(2)
      ];
      this.__openNodes(nodesToOpen);

      this.tree.closeNode(nodesToOpen[nodesToOpen.length - 1]);
      nodesToOpen.pop();

      var expected = this.__getVisibleItemsFrom(root, nodesToOpen);
      qx.lang.Array.insertAt(expected, root, 0);

      this.__testBuildLookupTable(expected);
    },


    testBuildLookupTableWithClosedRoot : function()
    {
      var root = this.createModelAndSetModel(1);

      this.tree.closeNode(root);
      this.__testBuildLookupTable([root]);
    },


    testBuildLookupTableWithNoModel : function()
    {
      this.createModelAndSetModel(1);

      this.tree.setModel(null);
      this.__testBuildLookupTable([]);
    },


    testBuildLookupTableOnModelChange : function()
    {
      var root = this.createModelAndSetModel(1);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(2)
      ];
      this.__openNodes(nodesToOpen);

      var newBranch = new qx.test.ui.tree.virtual.Node("New Branch");
      this.__createNodes(newBranch, 2);
      root.getChildren().getItem(2).getChildren().push(newBranch);

      var expected = this.__getVisibleItemsFrom(root, nodesToOpen);
      qx.lang.Array.insertAt(expected, root, 0);

      this.__testBuildLookupTable(expected);
    },


    testBuildLookupTableWithHiddenRoot : function()
    {
      var root = this.createModelAndSetModel(1);

      this.tree.setHideRoot(true);

      var expected = this.__getVisibleItemsFrom(root, [root]);
      this.__testBuildLookupTable(expected);
    },


    testBuildLookupWithoutLeafs : function()
    {
      var root = this.createModelAndSetModel(2);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(2)
      ];
      this.__openNodes(nodesToOpen);

      this.tree.setShowLeafs(false);

      var allVisibleItems = this.__getVisibleItemsFrom(root, nodesToOpen);
      qx.lang.Array.insertAt(allVisibleItems, root, 0);

      var expected = [];
      for (var i = 0; i < allVisibleItems.length; i++)
      {
        var item = allVisibleItems[i];
        if (this.tree.isNode(item)) {
          expected.push(item);
        }
      }
      this.__testBuildLookupTable(expected);
    },


    __testBuildLookupTable : function(expected)
    {
      this.assertArrayEquals(expected, this.tree.getLookupTable().toArray());
      this.assertEquals(expected.length, this.tree.getPane().getRowConfig().getItemCount());
    },


    testGetOpenNodes : function()
    {
      var root = this.createModelAndSetModel(1);
      this.assertArrayEquals([root], this.tree.getOpenNodes());
    },


    testIsNodeOpen : function()
    {
      var root = this.createModelAndSetModel(2);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(0)
      ];
      this.__openNodes(nodesToOpen);

      this.assertTrue(this.tree.isNodeOpen(nodesToOpen[0]));
      this.assertTrue(this.tree.isNodeOpen(nodesToOpen[1]));
      this.assertFalse(this.tree.isNodeOpen(root.getChildren().getItem(1)));
    },


    testOpenNode : function()
    {
      var root = this.createModelAndSetModel(3);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(0)
      ];

      this.__openNodes(nodesToOpen);
      this.assertArrayEquals(nodesToOpen, this.tree.getOpenNodes());

      this.tree.openNode(nodesToOpen[1]);
      this.assertArrayEquals(nodesToOpen, this.tree.getOpenNodes());
    },


    testCloseNode : function()
    {
      var root = this.createModelAndSetModel(2);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(0)
      ];

      this.__openNodes(nodesToOpen);
      this.assertArrayEquals(nodesToOpen, this.tree.getOpenNodes());

      this.tree.closeNode(nodesToOpen[1]);
      nodesToOpen.pop();
      this.assertArrayEquals(nodesToOpen, this.tree.getOpenNodes());
    },


    testCloseNodeWithRoot : function()
    {
      var root = this.createModelAndSetModel(2);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(0)
      ];

      this.__openNodes(nodesToOpen);
      this.assertArrayEquals(nodesToOpen, this.tree.getOpenNodes());

      this.tree.closeNode(nodesToOpen[1]);
      this.tree.closeNode(nodesToOpen[0]);
      this.assertArrayEquals([], this.tree.getOpenNodes());
    },


    testOpenNodeWithParents : function()
    {
      var root = this.createModelAndSetModel(3);

      var expectedOpen = [
        root,
        root.getChildren().getItem(4),
        root.getChildren().getItem(4).getChildren().getItem(4),
        root.getChildren().getItem(4).getChildren().getItem(4).getChildren().getItem(4)
      ];
      this.tree.openNodeAndParents(expectedOpen[3]);

      var openNodes = this.tree.getOpenNodes();
      this.assertEquals(expectedOpen.length, openNodes.length);
      for (var i = 0; i < expectedOpen.length; i++) {
        this.assertTrue(qx.lang.Array.contains(openNodes, expectedOpen[i]));
      }
    },


    testIsNode : function()
    {
      var root = this.createModelAndSetModel(3);

      this.assertTrue(this.tree.isNode(root));
      this.assertTrue(this.tree.isNode(root.getChildren().getItem(4)));
      this.assertTrue(this.tree.isNode(root.getChildren().getItem(4).getChildren().getItem(4)));
      this.assertTrue(this.tree.isNode(root.getChildren().getItem(4).getChildren().getItem(4).getChildren().getItem(4)));
      this.assertFalse(this.tree.isNode(root.getChildren().getItem(4).getChildren().getItem(4).getChildren().getItem(4).getChildren().getItem(4)));
    },


    testGetLevel : function()
    {
      var root = this.createModelAndSetModel(3);

      var nodesToOpen = [
        root,
        root.getChildren().getItem(2),
        root.getChildren().getItem(2).getChildren().getItem(3),
        root.getChildren().getItem(2).getChildren().getItem(3).getChildren().getItem(1)
      ];
      this.__openNodes(nodesToOpen);

      this.assertEquals(0, this.tree.getLevel(this.__getRowFrom(nodesToOpen[0])));
      this.assertEquals(1, this.tree.getLevel(this.__getRowFrom(nodesToOpen[1])));
      this.assertEquals(2, this.tree.getLevel(this.__getRowFrom(nodesToOpen[2])));
      this.assertEquals(3, this.tree.getLevel(this.__getRowFrom(nodesToOpen[3])));
      this.assertEquals(4, this.tree.getLevel(this.__getRowFrom(nodesToOpen[3].getChildren().getItem(4))));
    },


    testGetLevelWithHiddenRoot : function()
    {
      var root = this.createModelAndSetModel(1);
      this.tree.openNode(root.getChildren().getItem(4));
      this.tree.setHideRoot(true);

      var excpected = [
        root.getChildren().getItem(4),
        root.getChildren().getItem(4).getChildren().getItem(2)
      ];

      this.assertEquals(0, this.tree.getLevel(this.__getRowFrom(excpected[0])));
      this.assertEquals(1, this.tree.getLevel(this.__getRowFrom(excpected[1])));
    },


    testHasChildren : function()
    {
      var root = this.createModelAndSetModel(1);
      this.assertTrue(this.tree.hasChildren(root));

      var node = new qx.test.ui.tree.virtual.Node("Node");
      this.assertFalse(this.tree.hasChildren(node));
      node.dispose();
    },


    testHasChildrenHideLeafs : function()
    {
      var root = this.createModelAndSetModel(2);
      this.tree.setShowLeafs(false);
      this.assertTrue(this.tree.hasChildren(root));
      this.tree.openNode(root.getChildren().getItem(0))
      this.assertTrue(this.tree.hasChildren(root.getChildren().getItem(0)));

      var node = new qx.test.ui.tree.virtual.Node("Node");
      this.__createLeafs(node, 1);
      this.assertFalse(this.tree.hasChildren(node));
      node.dispose();

      var node = new qx.test.ui.tree.virtual.Node("Node");
      this.assertFalse(this.tree.hasChildren(node));
      node.dispose();
    },


    testSetOpenModeWithClick : function()
    {
      this.tree.setOpenMode("click");
      this.__testOpenMode(false, true);

      this.tree.resetOpenMode();
      this.__testOpenMode(true, false);
    },


    testSetOpenModeWithNone : function()
    {
      this.tree.setOpenMode("none");
      this.__testOpenMode(false, false);

      this.tree.resetOpenMode();
      this.__testOpenMode(true, false);
    },


    __testOpenMode : function(dblclick, click)
    {
      var pane = this.tree.getPane();
      this.assertEquals(
        dblclick,
        pane.hasListener("cellDblclick"),
        "Expected " + (dblclick ? "" : "no ") + " listener for 'cellDblclick'!"
      );
      this.assertEquals(
        click,
        pane.hasListener("cellClick"),
        "Expected " + (click ? "" : "no ") + " listener for 'cellClick'!"
      );
    },
    
    
    testSelection : function()
    {
      var root = this.createModelAndSetModel(2);
      var selection = this.tree.getSelection();
      selection.push(root);

      // check selection from list
      this.assertEquals(1, this.tree.getSelection().getLength(), "On Tree");
      this.assertEquals(root, selection.getItem(0), "On Tree");

      // check selection from manager
      var row = this.tree._manager.getSelectedItem();
      this.assertEquals(0, row);
    },
    
    
    testInvalidSelection : function()
    {
      var root = this.createModelAndSetModel(2);
      var selection = this.tree.getSelection();
      selection.push(root);
      selection.push(root.getChildren().getItem(0));

      // check selection from list
      this.assertEquals(1, this.tree.getSelection().getLength(), "On Tree");
      this.assertEquals(root.getChildren().getItem(0), selection.getItem(0), "On Tree");

      // check selection from manager
      var selection = this.tree._manager.getSelection();
      this.assertEquals(1, selection.length);
      this.assertEquals(1, selection[0]);
    },

    
    testSelectionByUserInteraction : function()
    {
      var root = this.createModelAndSetModel(2);
      var selection = this.tree.getSelection();

      this.tree._manager.selectItem(2);

      this.assertEquals(1, selection.getLength());
      this.assertEquals(root.getChildren().getItem(1), selection.getItem(0));
      this.assertEquals(2, this.tree._manager.getSelectedItem());
    },

    
    testSelectionEventByUserInteraction : function()
    {
      var root = this.createModelAndSetModel(2);
      var selection = this.tree.getSelection();

      var that = this;
      this.assertEventFired(selection, "change",
        function() {
          that.tree._manager.selectItem(2);
        },
        function(e)
        {
          this.assertEquals(1, selection.getLength());
          this.assertEquals(root.getChildren().getItem(1), selection.getItem(0));
          this.assertEquals(2, that.tree._manager.getSelectedItem());
        }
      );
    },
    
    
    testSelectionWithClosedNode : function()
    {
      var root = this.createModelAndSetModel(2);
      var selection = this.tree.getSelection();

      var parent = root.getChildren().getItem(0);
      var itemToSelect = parent.getChildren().getItem(2); 
      this.tree.openNode(parent);
      selection.push(itemToSelect);
      
      // check selection from list
      this.assertEquals(1, selection.getLength(), "On Tree");
      this.assertEquals(itemToSelect, selection.getItem(0), "On Tree");

      // check selection from manager
      var selectionOnManager = this.tree._manager.getSelection();
      this.assertEquals(1, selectionOnManager.length);
      this.assertEquals(this.tree.getLookupTable().indexOf(itemToSelect), selectionOnManager[0]);
      
      this.tree.closeNode(parent);
      var selectionOnManager = this.tree._manager.getSelection();
      this.assertEquals(0, selection.getLength(), "Selection not reset on Tree");
      this.assertEquals(0, selectionOnManager.length, "Selection not reset on manager");
    },


    /*
    ---------------------------------------------------------------------------
      HELPER METHODS TO CREATE A TREE STRUCTURE
    ---------------------------------------------------------------------------
    */


    __createNodes : function(parent, level) {
      if (level > 0)
      {
        for (var i = 0; i < 5; i++)
        {
          var item = new qx.test.ui.tree.virtual.Node("Node " + this.__getPrefix(parent) + i);
          parent.getChildren().push(item);

          this.__createNodes(item, level - 1);
          this.__createLeafs(item);
        }
      }
    },


    __createLeafs : function(parent)
    {
      for (var i = 0; i < 5; i++)
      {
        var child = new qx.test.ui.tree.virtual.Leaf("Leaf " + this.__getPrefix(parent) + i);
        parent.getChildren().push(child);
      }
    },


    __getPrefix : function(item)
    {
      var name = item.getName();
      var prefix = "";
      if (qx.lang.String.startsWith(name, "Node")) {
        prefix = name.substr(5, name.length - 5) + ".";
      }
      return prefix;
    },


    /*
    ---------------------------------------------------------------------------
      HELPER METHOD TO CALCULATE THE VISIBLE ITEMS
    ---------------------------------------------------------------------------
    */


    __getVisibleItemsFrom : function(parent, openNodes)
    {
      var expected = [];

      if (parent.getChildren() != null)
      {
        for (var i = 0; i < parent.getChildren().getLength(); i++)
        {
          var child = parent.getChildren().getItem(i);
          expected.push(child);

          if (openNodes.indexOf(child) > -1)
          {
            var otherExpected = this.__getVisibleItemsFrom(child, openNodes);
            expected = expected.concat(otherExpected);
          }
        }
      }

      return expected;
    },


    /*
    ---------------------------------------------------------------------------
      HELPER METHOD TO CALCULATE THE VISIBLE ITEMS
    ---------------------------------------------------------------------------
    */


    __getRowFrom : function(item) {
      return this.tree.getLookupTable().indexOf(item);
    },


    /*
    ---------------------------------------------------------------------------
      HELPER METHOD TO OPEN NODES ON TREE
    ---------------------------------------------------------------------------
    */


    __openNodes : function(nodes)
    {
      for (var i = 0; i < nodes.length; i++) {
        this.tree.openNode(nodes[i]);
      }
    }
  },


  destruct : function() {
    qx.Class.undefine("qx.test.ui.tree.virtual.Leaf");
    qx.Class.undefine("qx.test.ui.tree.virtual.Node");
  }
});