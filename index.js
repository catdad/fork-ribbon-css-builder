/* jshint browser: true, devel: true */
/* global less, request, ColorPicker, prettyPrintOne */

// util
function O(id){ return document.getElementById(id); }
function Q(selector){ return document.querySelector(selector); }
function Qa(selector){ return document.querySelectorAll(selector); }

// https://gist.github.com/catdad/11239214
var forEach = function(obj, cb, context){
    /* jshint -W030 */
    
    // check for a native forEach function
    var native = [].forEach,
        hasProp = Object.prototype.hasOwnProperty;
    
    // if there is a native function, use it
    if (native && obj.forEach === native) {
        //don't bother if there is no function
        cb && obj.forEach(cb, context);
    }
    // if the object is array-like
    else if (obj.length === +obj.length) {
        // loop though all values
        for (var i = 0, length = obj.length; i < length; i++) {
            // call the function with the context and native-like arguments
            cb && cb.call(context, obj[i], i, obj);
        }
    }
    // it's an object, use the keys
    else {
        // loop through all keys
        for (var name in obj){
            // call the function with context and native-like arguments
            if (hasProp.call(obj, name)) {
                cb && cb.call(context, obj[name], name, obj);
            }
        }
    }
};

//default config
var vars = {
    templateLessCode: "",
    cssRibbonCode: "",
    position: "top-right",
    color: "#F6C304",
    text: "#fff",
    link: "#",
    flat: false,
    fork: O("fork")
};

var rawCSSCode = {
    dom: O("rawcss"),
    setValue: function(text){
        //text = text.replace(/\/\*[^*]+\*\//g, '');
        this.dom.innerHTML = prettyPrintOne(text, "css");
    }
};
var copypasteCode = {
    dom: O("copypaste"),
    setValue: function (text){
        this.dom.innerHTML = "";
        var textNode = document.createTextNode(text);
        this.dom.appendChild(textNode);
//        this.dom.innerHTML = prettyPrintOne(this.dom.innerHTML);
    }
};

// run LESS compiler
function getLessCode(text, callback) {
    var lessParser = new less.Parser({
        env: "Production",
        logLevel: 0
    });
    
    lessParser.parsers.comments = function(){ return []; };
    
    lessParser.parse(text, function(err, tree){
        if (err || !tree.toCSS) {
            callback(err || true);
        } else {
            callback(null, tree.toCSS());
        }
    }, { 
//        modifyVars: {
//            '@ribbonColor': vars.color,
//            '@textColor': vars.text
//        }
    });
}

function parseRibbonCSS(css){
    var parsedCSS = css.match(/\.ribbon[\s]{0,}{[^}]*}/);
    if (parsedCSS){
        return parsedCSS[0];
    }
    return '';
}

//generates ribbon text
function getAnchorText(style){
    return "<a href='" + vars.link + "' style='" + style + "'>Fork me on GitHub</a>";
}

function init(){
    //sets new ribbon style and code
    function set(){
        var flatMixin = (vars.flat) ? '.flat;' : '.non-flat;',
            positionMixin = '.' + vars.position + ';';
        
        var lessCode = vars.templateLessCode
                        .replace(/{{ribbonColor}}/g, vars.color)
                        .replace(/{{textColor}}/g, vars.text)
                        .replace(/{{mixins}}/g, positionMixin + flatMixin);
        
        getLessCode(lessCode, function(err, cssCode){
            vars.cssRibbonCode = parseRibbonCSS(cssCode);
            
            var styleText = vars.cssRibbonCode
                                // remove the leading ".ribbon {"    
                                .replace(/\.ribbon\s{0,}\{/g, '')
                                // remove the ending "}"
                                .replace(/\}/g, '')
                                // remove any comments
                                .replace(/\/\*[^*]+\*\//g, '')
                                // remove multiple white spaces
                                .replace(/\s{2,}/g, '')
                                // remove white space after CSS name
                                .replace(/\:\s/g, ':')
                                // remove white space at the beginning and end of string
                                .trim();
            
            // set the style on the preview ribbon
            vars.fork.setAttribute('style', styleText);
            
            // set the copy/pase anchor code block
            copypasteCode.setValue( getAnchorText(styleText) );
            // set the CSS code block
            rawCSSCode.setValue(vars.cssRibbonCode);
        });
    }

    //radio button change
    function setRadio(ev){
        vars[ev.target.name] = ev.target.value;
        set();
    }
    forEach(Qa("input[type=radio]"), function(el){
        el.onchange = setRadio;
    });

    //link text change
    Q("input[name=link]").onchange = function(){
        vars.link = this.value;
        set();
    };

    //shadow flag change
    Q("input[name=flat]").onchange = function(){
        vars.flat = this.checked;
        set();
    };	

    //color picker
    var cp = ColorPicker( O('slider'), O('picker'),
    function(hex, hsv, rgb) {
        vars.color = hex;
        Q("input[name=hex]").value = hex.toUpperCase();
        set();
    });
    //init color picker
    cp.setHex( vars.color );

    //manual hex change
    Q("input[name=hex]").onchange = function(){
        cp.setHex(this.value);
    };   
}

request({ url: 'sample.less' },function(err, body){
    // save the code
    vars.templateLessCode = body;
    
    init();
});
