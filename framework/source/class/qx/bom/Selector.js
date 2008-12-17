/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2008 Sebastian Werner, http://sebastian-werner.net

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

   ======================================================================

   This class contains code based on the following work:

   * Sizzle
     http://ejohn.org
     commit 62bf2902513e135b5aa888291de242a3da59afdd
     tree   a79acf482099538745bd9a395bc86b0f869e4d7a
     parent 5d980752ca8fb5a4237667289ea142f0bdf03329 
     date   12/13/08
     
     Copyright:
       (c) 2008, John Resig

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

************************************************************************ */

/**
 * EXPERIMENTAL - NOT READY FOR PRODUCTION
 * 
 * Selector engine based on Sizzle by John Resig
 */
qx.Class.define("qx.bom.Selector", 
{
  statics :
  {
    /*
    *****************************************************************************
       PRIVATE HELPERS
    *****************************************************************************
    */    

    __chunker : /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]+\]|[^[\]]+)+\]|\\.|[^ >+~,(\[]+)+|[>+~])(\s*,\s*)?/g,
    __cache : null,
    done : 0,

    __invalidate : function() {
      this.__cache = {};
    },
    
    __makeArray : function(array, results) {},
    
    __makeArrayNative : function(array, results) 
    {
      array = Array.prototype.slice.call( array );
    
      if ( results ) {
        results.push.apply( results, array );
        return results;
      }
      
      return array;
    },
    
    __makeArrayAlternative : function(array, results)
    {
      var ret = results || [];
  
      if ( array instanceof Array ) {
        Array.prototype.push.apply( ret, array );
      } else {
        for ( var i = 0; array[i]; i++ ) {
          ret.push( array[i] );
        }
      }
  
      return ret;      
    },
    
    __dirNodeCheck : function( dir, cur, doneName, checkSet, nodeCheck ) {
      for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];
        if ( elem ) {
          elem = elem[dir]
          var match = false;
    
          while ( elem && elem.nodeType ) {
            var done = elem[doneName];
            if ( done ) {
              match = checkSet[ done ];
              break;
            }
    
            if ( elem.nodeType === 1 )
              elem[doneName] = i;
    
            if ( elem.nodeName === cur ) {
              match = elem;
              break;
            }
    
            elem = elem[dir];
          }
    
          checkSet[i] = match;
        }
      }
    },
    
    __dirCheck : function( dir, cur, doneName, checkSet, nodeCheck ) {
      for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];
        if ( elem ) {
          elem = elem[dir]
          var match = false;
    
          while ( elem && elem.nodeType ) {
            if ( elem[doneName] ) {
              match = checkSet[ elem[doneName] ];
              break;
            }
    
            if ( elem.nodeType === 1 ) {
              elem[doneName] = i;
    
              if ( typeof cur !== "string" ) {
                if ( elem === cur ) {
                  match = true;
                  break;
                }
    
              } else if ( qx.bom.Selector.filter( cur, [elem] ).length > 0 ) {
                match = elem;
                break;
              }
            }
    
            elem = elem[dir];
          }
    
          checkSet[i] = match;
        }
      }
    },
    
    
    
    
    
    /*
    *****************************************************************************
       PUBLIC API
    *****************************************************************************
    */    
    
    /**
     * Queries
     */
    query : function(selector, context, results, seed) 
    {
      var doCache = !results;
      results = results || [];
      context = context || document;

      if ( context.nodeType !== 1 && context.nodeType !== 9 )
        return [];
  
      if ( !selector || typeof selector !== "string" ) {
        return results;
      }

      var cache = this.__cache;
      if ( cache && context === document && cache[ selector ] ) {
        results.push.apply( results, cache[ selector ] );
        return results;
      }
  
      var parts = [], m, set, checkSet, check, mode, extra;
  
      // Reset the position of the chunker regexp (start from head)
      var chunker = this.__chunker;
      chunker.lastIndex = 0;
  
      while ( (m = chunker.exec(selector)) !== null ) {
        parts.push( m[1] );
    
        if ( m[2] ) {
          extra = RegExp.rightContext;
          break;
        }
      }

      var Expr = qx.bom.Selector.selectors;
      if ( parts.length > 1 && Expr.match.POS.exec( selector ) ) {
        if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
          var later = "", match;
    
          // Position selectors must be done after the filter
          while ( (match = Expr.match.POS.exec( selector )) ) {
            later += match[0];
            selector = selector.replace( Expr.match.POS, "" );
          }
    
          checkSet = qx.bom.Selector.filter( later, qx.bom.Selector.query( selector, context, results ) );
        } else {
          checkSet = Expr.relative[ parts[0] ] ?
            [ context ] :
            qx.bom.Selector.query( parts.shift(), context );
    
          while ( parts.length ) {
            set = [];
    
            selector = parts.shift();
            if ( Expr.relative[ selector ] )
              selector += parts.shift();
    
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
              qx.bom.Selector.query( selector, checkSet[i], set );
            }
    
            checkSet = set;
          }
        }
      } else {
        var ret = seed ?
          { expr: parts.pop(), set: makeArray(seed) } :
          qx.bom.Selector.find( parts.pop(), parts.length === 1 && context.parentNode ? context.parentNode : context );
        set = qx.bom.Selector.filter( ret.expr, ret.set );
    
        if ( parts.length > 0 ) {
          checkSet = makeArray(set);
        }
    
        while ( parts.length ) {
          var cur = parts.pop(), pop = cur;
    
          if ( !Expr.relative[ cur ] ) {
            cur = "";
          } else {
            pop = parts.pop();
          }
    
          if ( pop == null ) {
            pop = context;
          }
    
          Expr.relative[ cur ]( checkSet, pop );
        }
    
        if ( !checkSet ) {
          checkSet = set;
        }
      }
    
      if ( !checkSet ) {
        throw "Syntax error, unrecognized expression: " + (cur || selector);
      }

      if ( checkSet instanceof Array ) {
        if ( context.nodeType === 1 ) {
          for ( var i = 0; checkSet[i] != null; i++ ) {
            if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
              results.push( set[i] );
            }
          }
        } else {
          for ( var i = 0; checkSet[i] != null; i++ ) {
            if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
              results.push( set[i] );
            }
          }
        }
      } else {
        qx.bom.Selector.__makeArray( checkSet, results );
      }

      if ( extra ) {
        qx.bom.Selector.query( extra, context, results );
      }

      if ( cache && doCache ) {
        cache[selector] = results.slice(0);
      }

      return results;
    },
    
    
    /**
     * Matches
     */    
    matches : function(expr, set){
      return this.query(expr, null, null, set);
    },
    
    
    /**
     * Finds
     */    
    find : function(expr, context)
    {
      var set, match;
      var Expr = qx.bom.Selector.selectors;

      if ( !expr ) {
        return [];
      }

      var later = "", match;

      // Pseudo-selectors could contain other selectors (like :not)
      while ( (match = Expr.match.PSEUDO.exec( expr )) ) {
        var left = RegExp.leftContext;

        if ( left.substr( left.length - 1 ) !== "\\" ) {
          later += match[0];
          expr = expr.replace( Expr.match.PSEUDO, "" );
        } else {
          // TODO: Need a better solution, fails: .class\:foo:realfoo(#id)
          break;
        }
      }

      for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
        var type = Expr.order[i];
    
        if ( (match = Expr.match[ type ].exec( expr )) ) {
          var left = RegExp.leftContext;

          if ( left.substr( left.length - 1 ) !== "\\" ) {
            match[1] = (match[1] || "").replace(/\\/g, "");
            set = Expr.find[ type ]( match, context );

            if ( set != null ) {
              expr = expr.replace( Expr.match[ type ], "" );
              break;
            }
          }
        }
      }

      if ( !set ) {
        set = context.getElementsByTagName("*");
      }

      expr += later;

      return {set: set, expr: expr};
    },
    
    
    /**
     * Filters
     */
    filter : function(expr, set, inplace)
    {
      var old = expr, result = [], curLoop = set, match;
      var Expr = qx.bom.Selector.selectors;

      while ( expr && set.length ) {
        for ( var type in Expr.filter ) {
          if ( (match = Expr.match[ type ].exec( expr )) != null ) {
            var anyFound = false, filter = Expr.filter[ type ], goodArray = null;
            match[1] = (match[1] || "").replace(/\\/g, "");

            if ( curLoop == result ) {
              result = [];
            }

            if ( Expr.preFilter[ type ] ) {
              match = Expr.preFilter[ type ]( match, curLoop );

              if ( match[0] === true ) {
                goodArray = [];
                var last = null, elem;
                for ( var i = 0; (elem = curLoop[i]) !== undefined; i++ ) {
                  if ( elem && last !== elem ) {
                    goodArray.push( elem );
                    last = elem;
                  }
                }
              }

            }

            var goodPos = 0, found, item;

            for ( var i = 0; (item = curLoop[i]) !== undefined; i++ ) {
              if ( item ) {
                if ( goodArray && item != goodArray[goodPos] ) {
                  goodPos++;
                }

                found = filter( item, match, goodPos, goodArray );
                if ( inplace && found != null ) {
                  curLoop[i] = found ? curLoop[i] : false;
                  if ( found ) {
                    anyFound = true;
                  }    							
                } else if ( found ) {
                  result.push( item );
                  anyFound = true;
                }
              }
            }

            if ( found !== undefined ) {
              if ( !inplace ) {
                curLoop = result;
              }

              expr = expr.replace( Expr.match[ type ], "" );

              if ( !anyFound ) {
                return [];
              }

              break;
            }
          }
        }

        expr = expr.replace(/\s*,\s*/, "");

        // Improper expression
        if ( expr == old ) {
          throw "Syntax error, unrecognized expression: " + expr;
        }

        old = expr;
      }

      return curLoop;
    },
    

    /*
    ==============================================================================
      SELECTORS
    ==============================================================================
    */
    selectors :
    {
      /** 
       * ORDER
       **/
      order: [ "ID", "NAME", "TAG" ],
      
      
      /** 
       * MATCH
       **/      
      match: 
      {
        ID: /#((?:[\w\u0128-\uFFFF_-]|\\.)+)/,
        CLASS: /\.((?:[\w\u0128-\uFFFF_-]|\\.)+)/,
        NAME: /\[name=((?:[\w\u0128-\uFFFF_-]|\\.)+)\]/,
        ATTR: /\[((?:[\w\u0128-\uFFFF_-]|\\.)+)\s*(?:(\S{0,1}=)\s*(['"]*)(.*?)\3|)\]/,
        TAG: /^((?:[\w\u0128-\uFFFF\*_-]|\\.)+)/,
        CHILD: /:(only|nth|last|first)-child\(?(even|odd|[\dn+-]*)\)?/,
        POS: /:(nth|eq|gt|lt|first|last|even|odd)\(?(\d*)\)?(?:[^-]|$)/,
        PSEUDO: /:((?:[\w\u0128-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
      },


      /** 
       * ATTRIBUTE MAP
       **/
      attrMap: {
        "class": "className"
      },
      
      
      /** 
       * RELATIVE
       **/
      relative: 
      {
        "+": function(checkSet, part)
        {
          for ( var i = 0, l = checkSet.length; i < l; i++ ) 
          {
            var elem = checkSet[i];
            if ( elem ) 
            {
              var cur = elem.previousSibling;
              while ( cur && cur.nodeType !== 1 ) {
                cur = cur.previousSibling;
              }
              checkSet[i] = typeof part === "string" ?
                cur || false :
                cur === part;
            }
          }

          if ( typeof part === "string" ) {
            qx.bom.Selector.filter( part, checkSet, true );
          }
        },
        
        ">": function(checkSet, part)
        {
          if ( typeof part === "string" && !/\W/.test(part) ) 
          {
            part = part.toUpperCase();

            for ( var i = 0, l = checkSet.length; i < l; i++ ) 
            {
              var elem = checkSet[i];
              if ( elem ) 
              {
                var parent = elem.parentNode;
                checkSet[i] = parent.nodeName === part ? parent : false;
              }
            }
          } 
          else 
          {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) 
            {
              var elem = checkSet[i];
              if ( elem ) 
              {
                checkSet[i] = typeof part === "string" ?
                  elem.parentNode :
                  elem.parentNode === part;
              }
            }

            if ( typeof part === "string" ) {
              qx.bom.Selector.filter( part, checkSet, true );
            }
          }
        },
        
        "": function(checkSet, part)
        {
          var doneName = "done" + (done++), checkFn = qx.bom.Selector.__dirCheck;

          if ( !part.match(/\W/) ) {
            var nodeCheck = part = part.toUpperCase();
            checkFn = qx.bom.Selector.__dirNodeCheck;
          }

          checkFn("parentNode", part, doneName, checkSet, nodeCheck);
        },
        
        "~": function(checkSet, part)
        {
          var doneName = "done" + (done++), checkFn = qx.bom.Selector.__dirCheck;

          if ( typeof part === "string" && !part.match(/\W/) ) {
            var nodeCheck = part = part.toUpperCase();
            checkFn = qx.bom.Selector.__dirNodeCheck;
          }

          checkFn("previousSibling", part, doneName, checkSet, nodeCheck);
        }
      },
      

      /** 
       * FIND
       **/      
      find: 
      {
        ID: function(match, context) 
        {
          if ( context.getElementById ) 
          {
            var m = context.getElementById(match[1]);
            return m ? [m] : [];
          }
        },
        
        NAME: function(match, context){
          return context.getElementsByName(match[1]);
        },
        
        TAG: function(match, context){
          return context.getElementsByTagName(match[1]);
        }
      },
      
      
      /** 
       * PRE FILTER
       **/
      preFilter: 
      {
        CLASS: function(match) {
          return new RegExp( "(?:^|\\s)" + match[1] + "(?:\\s|$)" );
        },
        
        ID: function(match) {
          return match[1];
        },
        
        TAG: function(match) {
          return match[1].toUpperCase();
        },
        
        CHILD: function(match)
        {
          if ( match[1] == "nth" ) {
            // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
            var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
              match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
              !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

            // calculate the numbers (first)n+(last) including if they are negative
            match[2] = (test[1] + (test[2] || 1)) - 0;
            match[3] = test[3] - 0;
          }

          // TODO: Move to normal caching system
          match[0] = "done" + (done++);

          return match;
        },
        
        ATTR: function(match)
        {
          var name = match[1];
      
          if ( Expr.attrMap[name] ) {
            match[1] = Expr.attrMap[name];
          }
          
          if ( match[2] === "~=" ) {
            match[4] = " " + match[4] + " ";
          }    			

          return match;
        },
        
        PSEUDO: function(match)
        {
          if ( match[1] === "not" ) {
            match[3] = match[3].split(/\s*,\s*/);
          }
      
          return match;
        },
        
        POS: function(match)
        {
          match.unshift( true );
          return match;
        }
      },
      

      /** 
       * FILTERS 
       **/
      filters: 
      {
        enabled: function(elem){
          return elem.disabled === false && elem.type !== "hidden";
        },
        
        disabled: function(elem){
          return elem.disabled === true;
        },
        
        checked: function(elem){
          return elem.checked === true;
        },
        
        selected: function(elem){
          // Accessing this property makes selected-by-default
          // options in Safari work properly
          elem.parentNode.selectedIndex;
          return elem.selected === true;
        },
        
        parent: function(elem){
          return !!elem.firstChild;
        },
        
        empty: function(elem){
          return !elem.firstChild;
        },
        
        has: function(elem, i, match){
          return !!this(match[3], elem).length;
        },
        
        header: function(elem){
          return /h\d/i.test( elem.nodeName );
        },
        
        text: function(elem){
          return "text" === elem.type;
        },
        
        radio: function(elem){
          return "radio" === elem.type;
        },
        
        checkbox: function(elem){
          return "checkbox" === elem.type;
        },
        
        file: function(elem){
          return "file" === elem.type;
        },
        
        password: function(elem){
          return "password" === elem.type;
        },
        
        submit: function(elem){
          return "submit" === elem.type;
        },
        
        image: function(elem){
          return "image" === elem.type;
        },
        
        reset: function(elem){
          return "reset" === elem.type;
        },
        
        button: function(elem){
          return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
        },
        
        input: function(elem){
          return /input|select|textarea|button/i.test(elem.nodeName);
        }
      },
      
      
      /** 
       * SET FILTERS 
       **/
      setFilters: 
      {
        first: function(elem, i){
          return i === 0;
        },
        
        last: function(elem, i, match, array){
          return i === array.length - 1;
        },
        
        even: function(elem, i){
          return i % 2 === 0;
        },
        
        odd: function(elem, i){
          return i % 2 === 1;
        },
        
        lt: function(elem, i, match){
          return i < match[3] - 0;
        },
        
        gt: function(elem, i, match){
          return i > match[3] - 0;
        },
        
        nth: function(elem, i, match){
          return match[3] - 0 == i;
        },
        
        eq: function(elem, i, match){
          return match[3] - 0 == i;
        }
      },
      
      
      /** 
       * FILTER
       **/
      filter: 
      {
        CHILD: function(elem, match)
        {
          var type = match[1], parent = elem.parentNode;

          var doneName = match[0];
      
          if ( parent && !parent[ doneName ] ) 
          {
            var count = 1;

            for ( var node = parent.firstChild; node; node = node.nextSibling ) 
            {
              if ( node.nodeType == 1 ) {
                node.nodeIndex = count++;
              }
            }

            parent[ doneName ] = count - 1;
          }

          if ( type == "first" ) {
            return elem.nodeIndex == 1;
          } 
          else if ( type == "last" ) {
            return elem.nodeIndex == parent[ doneName ];
          } 
          else if ( type == "only" ) {
            return parent[ doneName ] == 1;
          } 
          else if ( type == "nth" ) 
          {
            var add = false, first = match[2], last = match[3];

            if ( first == 1 && last == 0 ) {
              return true;
            }

            if ( first == 0 ) {
              if ( elem.nodeIndex == last ) {
                add = true;
              }
            } else if ( (elem.nodeIndex - last) % first == 0 && (elem.nodeIndex - last) / first >= 0 ) {
              add = true;
            }

            return add;
          }
        },
        
        PSEUDO: function(elem, match, i, array)
        {
          var name = match[1], filter = Expr.filters[ name ];

          if ( filter ) {
            return filter( elem, i, match, array )
          } 
          else if ( name === "contains" ) {
            return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
          } 
          else if ( name === "not" ) 
          {
            var not = match[3];

            for (var i = 0, l = not.length; i < l; i++ ) {
              if (qx.bom.Selector.filter(not[i], [elem]).length > 0 ) {
                return false;
              }
            }

            return true;
          }
        },
        
        ID: function(elem, match){
          return elem.nodeType === 1 && elem.getAttribute("id") === match;
        },
        
        TAG: function(elem, match){
          return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
        },
        
        CLASS: function(elem, match){
          return match.test( elem.className );
        },
        
        ATTR: function(elem, match)
        {
          var result = elem[ match[1] ] || elem.getAttribute( match[1] ), value = result + "", type = match[2], check = match[4];
          
          return result == null ?
            false :
            type === "=" ?
            value === check :
            type === "*=" ?
            value.indexOf(check) >= 0 :
            type === "~=" ?
            (" " + value + " ").indexOf(check) >= 0 :
            !match[4] ?
            result :
            type === "!=" ?
            value != check :
            type === "^=" ?
            value.indexOf(check) === 0 :
            type === "$=" ?
            value.substr(value.length - check.length) === check :
            type === "|=" ?
            value === check || value.substr(0, check.length + 1) === check + "-" :
            false;
        },
        
        POS: function(elem, match, i, array){
          var name = match[2], filter = Expr.setFilters[ name ];

          if ( filter ) {
            return filter( elem, i, match, array );
          }
        }
      }      
    }    
  },
  
  defer : function(statics)
  {
    if (document.addEventListener && !document.querySelectorAll) 
    {
      statics.__cache = {};
      document.addEventListener("DOMAttrModified", statics.__invalidate, false);
      document.addEventListener("DOMNodeInserted", statics.__invalidate, false);
      document.addEventListener("DOMNodeRemoved", statics.__invalidate, false);
    }
    
    // Perform a simple check to determine if the browser is capable of
    // converting a NodeList to an array using builtin methods.    
    try {
      Array.prototype.slice.call( document.documentElement.childNodes );
      statics.__makeArray = statics.__makeArrayNative;
    } catch(e){    
      statics.__makeArray = statics.__makeArrayManual;
    }
    
    // Check to see if the browser returns elements by name when
    // querying by getElementById (and provide a workaround)
    (function(){
      // We're going to inject a fake input element with a specified name
      var form = document.createElement("form"),
        id = "script" + (new Date).getTime();
      form.innerHTML = "<input name='" + id + "'/>";
    
      // Inject it into the root element, check its status, and remove it quickly
      var root = document.documentElement;
      root.insertBefore( form, root.firstChild );
    
      // The workaround has to do additional checks after a getElementById
      // Which slows things down for other browsers (hence the branching)
      if ( !!document.getElementById( id ) ) {
        var Expr = qx.bom.Selector.selectors;
        Expr.find.ID = function(match, context){
          if ( context.getElementById ) {
            var m = context.getElementById(match[1]);
            return m ? m.id === match[1] || m.getAttributeNode && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
          }
        };
    
        Expr.filter.ID = function(elem, match){
          var node = elem.getAttributeNode && elem.getAttributeNode("id");
          return elem.nodeType === 1 && node && node.nodeValue === match;
        };
      }
    
      root.removeChild( form );
    })();
    
    if ( document.querySelectorAll ) (function(){
      var oldQuery = qx.bom.Selector.query;
      
      qx.bom.Selector.query = function(query, context, extra){
        context = context || document;
    
        if ( context.nodeType === 9 ) {
          try {
            return statics.makeArray( context.querySelectorAll(query) );
          } catch(e){}
        }
        
        return oldSizzle(query, context, extra);
      };
    })();
    
    if ( document.documentElement.getElementsByClassName ) {
      var Expr = qx.bom.Selector.selectors;
      Expr.order.splice(1, 0, "CLASS");
      Expr.find.CLASS = function(match, context) {
        return context.getElementsByClassName(match[1]);
      };
    }   
  }
});
