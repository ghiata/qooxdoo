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

************************************************************************ */

/* ************************************************************************



************************************************************************ */

/** A color popup */
qx.Class.define("qx.ui.component.ColorPopup",
{
  extend : qx.ui.popup.Popup,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(tables)
  {
    this.base(arguments);

    this.setPadding(4);
    this.auto();
    this.setBorder(qx.renderer.border.BorderPresets.getOutset());
    this.setBackgroundColor("threedface");

    this._tables = tables;

    this._createLayout();
    this._createAutoBtn();
    this._createBoxes();
    this._createPreview();
    this._createSelectorBtn();

    this.addEventListener("beforeAppear", this._onBeforeAppear);
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    value :
    {
      nullable : true,
      apply : "_modifyValue",
      event : "changeValue"
    },

    red :
    {
      check : "Number",
      init : 0,
      event : "changeRed"
    },

    green :
    {
      check : "Number",
      init : 0,
      event : "changeGreen"
    },

    blue :
    {
      check : "Number",
      init : 0,
      event : "changeBlue"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    _minZIndex : 1e5,




    /*
    ---------------------------------------------------------------------------
      CREATOR SUBS
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _createLayout : function()
    {
      this._layout = new qx.ui.layout.VerticalBoxLayout;
      this._layout.setLocation(0, 0);
      this._layout.auto();
      this._layout.setSpacing(2);

      this.add(this._layout);
    },


    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _createAutoBtn : function()
    {
      this._automaticBtn = new qx.ui.form.Button(this.tr("Automatic"));
      this._automaticBtn.setWidth(null);
      this._automaticBtn.setAllowStretchX(true);
      this._automaticBtn.addEventListener("execute", this._onAutomaticBtnExecute, this);

      this._layout.add(this._automaticBtn);
    },

    _recentTableId : "recent",
    _fieldWidth : 14,
    _fieldHeight : 14,
    _fieldNumber : 12,


    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _createBoxes : function()
    {
      this._boxes = {};

      var tables = this._tables;
      var table, box, boxLayout, field;

      for (var tableId in tables)
      {
        table = tables[tableId];

        box = new qx.ui.groupbox.GroupBox(table.label);
        box.setHeight("auto");

        this._boxes[tableId] = box;
        this._layout.add(box);

        boxLayout = new qx.ui.layout.HorizontalBoxLayout;
        boxLayout.setLocation(0, 0);
        boxLayout.setSpacing(1);
        boxLayout.auto();
        box.add(boxLayout);

        for (var i=0; i<this._fieldNumber; i++)
        {
          field = new qx.ui.basic.Terminator;

          field.setBorder(qx.renderer.border.BorderPresets.getThinInset());
          field.setBackgroundColor(table.values[i] || null);
          field.setDimension(this._fieldWidth, this._fieldHeight);

          field.addEventListener("mousedown", this._onFieldMouseDown, this);
          field.addEventListener("mouseover", this._onFieldMouseOver, this);

          boxLayout.add(field);
        }
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _createPreview : function()
    {
      this._previewBox = new qx.ui.groupbox.GroupBox(this.tr("Preview (Old/New)"));
      this._previewLayout = new qx.ui.layout.HorizontalBoxLayout;
      this._selectedPreview = new qx.ui.basic.Terminator;
      this._currentPreview = new qx.ui.basic.Terminator;

      this._previewLayout.setHeight("auto");
      this._previewLayout.setWidth("100%");
      this._previewLayout.setSpacing(4);
      this._previewLayout.add(this._selectedPreview, this._currentPreview);

      this._previewBox.setHeight("auto");
      this._previewBox.add(this._previewLayout);

      this._layout.add(this._previewBox);

      this._selectedPreview.setBorder(qx.renderer.border.BorderPresets.getInset());
      this._selectedPreview.setWidth("1*");
      this._selectedPreview.setHeight(24);

      this._currentPreview.setBorder(qx.renderer.border.BorderPresets.getInset());
      this._currentPreview.setWidth("1*");
      this._currentPreview.setHeight(24);
    },


    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _createSelectorBtn : function()
    {
      this._selectorButton = new qx.ui.form.Button(this.tr("Open ColorSelector"));
      this._selectorButton.setWidth(null);
      this._selectorButton.setAllowStretchX(true);
      this._selectorButton.addEventListener("execute", this._onSelectorButtonExecute, this);

      this._layout.add(this._selectorButton);
    },


    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _createColorSelector : function()
    {
      if (this._colorSelector) {
        return;
      }

      this._colorSelectorWindow = new qx.ui.window.Window(this.tr("Color Selector"));
      this._colorSelectorWindow.setMinWidth(null);
      this._colorSelectorWindow.setMinHeight(null);
      this._colorSelectorWindow.setResizeable(false);
      this._colorSelectorWindow.auto();

      this._colorSelector = new qx.ui.component.ColorSelector;
      this._colorSelector.setBorder(null);
      this._colorSelector.setLocation(0, 0);
      this._colorSelector.addEventListener("dialogok", this._onColorSelectorOk, this);
      this._colorSelector.addEventListener("dialogcancel", this._onColorSelectorCancel, this);

      this._colorSelectorWindow.add(this._colorSelector);
      this._colorSelectorWindow.addToDocument();
    },




    /*
    ---------------------------------------------------------------------------
      MODIFIER
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param propValue {var} Current value
     * @param propOldValue {var} Previous value
     * @param propData {var} Property configuration map
     * @return {Boolean} TODOC
     */
    _modifyValue : function(propValue, propOldValue, propData)
    {
      if (propValue === null)
      {
        this.setRed(null);
        this.setGreen(null);
        this.setBlue(null);
      }
      else
      {
        var rgb = qx.util.ColorUtil.stringToRgb(propValue);
        this.setRed(rgb[0]);
        this.setGreen(rgb[1]);
        this.setBlue(rgb[2]);
      }

      this._selectedPreview.setBackgroundColor(propValue);
      this._rotatePreviousColors();

      return true;
    },


    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _rotatePreviousColors : function()
    {
      var vRecentTable = this._tables[this._recentTableId].values;
      var vRecentBox = this._boxes[this._recentTableId];

      if (!vRecentTable) {
        return;
      }

      var newValue = this.getValue();

      if (!newValue) {
        return;
      }

      // Modifying incoming table
      var vIndex = vRecentTable.indexOf(newValue);

      if (vIndex != -1) {
        qx.lang.Array.removeAt(vRecentTable, vIndex);
      } else if (vRecentTable.length == this._fieldNumber) {
        vRecentTable.shift();
      }

      vRecentTable.push(newValue);

      // Sync to visible fields
      var vFields = vRecentBox.getFrameObject().getFirstChild().getChildren();

      for (var i=0; i<vFields.length; i++) {
        vFields[i].setBackgroundColor(vRecentTable[i] || null);
      }
    },




    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onFieldMouseDown : function(e)
    {
      var vValue = this._currentPreview.getBackgroundColor();
      this.setValue(vValue);

      if (vValue) {
        this.hide();
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onFieldMouseOver : function(e) {
      this._currentPreview.setBackgroundColor(e.getTarget().getBackgroundColor());
    },


    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onAutomaticBtnExecute : function(e)
    {
      this.setValue(null);
      this.hide();
    },


    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onSelectorButtonExecute : function(e)
    {
      this._createColorSelector();

      this._colorSelectorWindow.setTop(qx.html.Location.getPageBoxTop(this._selectorButton.getElement()) + 10);
      this._colorSelectorWindow.setLeft(qx.html.Location.getPageBoxLeft(this._selectorButton.getElement()) + 100);

      this.hide();

      this._colorSelectorWindow.open();
    },


    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onColorSelectorOk : function(e)
    {
      var sel = this._colorSelector;
      this.setValue(qx.util.ColorUtil.rgbToRgbString([sel.getRed(), sel.getGreen(), sel.getBlue()]));
      this._colorSelectorWindow.close();
    },


    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onColorSelectorCancel : function(e) {
      this._colorSelectorWindow.close();
    },


    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onBeforeAppear : function(e) {
      this._currentPreview.setBackgroundColor(null);
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this._disposeObjects("_layout", "_automaticBtn", "_previewBox", "_previewLayout",
      "_selectedPreview", "_currentPreview", "_selectorButton", "_colorSelectorWindow",
      "_colorSelector");

    this._disposeFields("_tables", "_boxes");
  }
});
