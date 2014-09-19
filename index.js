/* jshint browser: true, devel: true */
/* global $, less, request, ColorPicker, CodeMirror */

//default config
var vars = {
    templateLessCode: "",
    cssRibbonCode: "",
    position: "top-right",
    color: "#F6C304",
    text: "#fff",
    link: "#",
    flat: false
};

var dom = {
    rawCSS: O("rawcss"),
    copypaste: O("copypaste"),
    fork: O("fork")
};

var rawCSSCode = CodeMirror(dom.rawCSS, {
    value: '\n',
    mode: 'css',
    readOnly: true,
    tabSize: 8
});
var copypasteCode = {
    dom: dom.copypaste,
    setValue: function (text){
        this.dom.innerHTML = "";
        var textNode = document.createTextNode(text);
        this.dom.appendChild(textNode);
    }
};

// util
function O(id){ return document.getElementById(id); }

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
                                    .replace(/\.ribbon\s{0,}\{/g, '')
                                    .replace(/\}/g, '')
                                    .replace(/\/\*[^*]+\*\//g, '')
                                    .replace(/\s{2,}/g, '')
                                    .replace(/\:\s/g, ':')
                                    .trim();
            
            dom.fork.setAttribute('style', styleText);
            
            copypasteCode.setValue( getText(styleText) );
            rawCSSCode.setValue(vars.cssRibbonCode);
        });
    }

    //radio button change
    function setRadio(ev){
        vars[ev.target.name] = ev.target.value;
        set();
    }
    $("input[type=radio]").change(setRadio);

    //link text change
    $("input[name=link]").change(function(){
        vars.link = this.value;
        set();
    });

    //shadow flag change
    $("input[name=flat]").change(function(){
        vars.flat = this.checked;
        set();
    });	

    //color picker
    var cp = ColorPicker( O('slider'), O('picker'),
    function(hex, hsv, rgb) {
        vars.color = hex;
        $("input[name=hex]").val(hex);
        set();
    });
    //init color picker
    cp.setHex( vars.color );

    //manual hex change
    $("input[name=hex]").change(function(){
        cp.setHex(this.value);
    });   
}

request({ url: 'sample.less' },function(err, body){
    // save the code
    vars.templateLessCode = body;
    
    init();
});

//generates ribbon text
function getText(style){
    return "<a href='" + vars.link + "' style='" + style + "'>Fork me on GitHub</a>";
}
