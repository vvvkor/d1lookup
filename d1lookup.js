/*! d1lookup https://github.com/vvvkor/d1lookup */
/* Autocomplete lookups with data from XHTTP request */

//a.lookup[data-table]
if(typeof module !== "undefined") var d1 = require('d1css');
(function(){
main = new(function() {

  "use strict";

  this.name = 'lookup';

  this.opt = {
    attrLabel: 'data-label',
    attrLookup: 'data-lookup',
    attrUrl: 'data-url',
    attrGoto: 'data-goto',
    cacheLimit: 0,
    icon: 'edit',
    idList: 'lookup-list',
    max: 10,
    wait: 300,
    inPop: 0
  };
  
  this.seq = 0;
  this.win = null;

  this.init = function(opt) {
    var i;
    for(i in opt) this.opt[i] = opt[i];
    this.win = d1.ins('div', '', {id: this.opt.idList, className: 'toggle'});
    d1.setState(this.win, 0);
    document.querySelector('body').appendChild(this.win);

    var t = document.querySelectorAll('[' + this.opt.attrLookup + ']');
    for (i = 0; i < t.length; i++) this.prepare(t[i]);
    d1.b('','[data-chain]','change',this.updateChain.bind(this));
    d1.b('','[data-chain]','',this.updateChain.bind(this));   }

  this.prepare = function(n) {
    var pop = d1.ins('div', '', {className: 'pop l ' + (this.opt.inPop ? 'js-subinput' : '')}, n, 1);
    if(!this.opt.inPop) pop.style.verticalAlign = 'bottom';
    n.thePop = pop;
    n.classList.add('bg-n');
    n.classList.add('hide');
    //n.type = 'hidden';
    n.vLabel = n.getAttribute(this.opt.attrLabel) || n.value || '';//@@
    var mc = this.opt.inPop ? pop : d1.ins('span', '', {className:'js-subinput'}, pop, 1);
    var m = d1.ins('input', '', {type: 'text', value: n.vLabel, className:'input-lookup'}, mc);
    m.name = 'lookup-' + n.name;
    //m.required = n.required;
    //n.required = false;
    if(n.id) {
      m.id = 'lookup-' + n.id;
      if(n.title) m.title = n.title;
      d1.b('', '[for="' + n.id + '"]', '', function(lbl, e) { lbl.htmlFor = m.id; });
    }
    if(n.placeholder) m.placeholder = n.placeholder;
    m.autocomplete = 'off';
    var i = null;
    if(this.opt.icon && n.getAttribute(this.opt.attrUrl)){
      var ic = d1.ins('span', '', {className:'input-tools'}, mc, 1);//icons container
      i = d1.ins('a', d1.i(this.opt.icon), {}, ic);
      i.style.cursor = 'pointer';
      d1.ins('', ' ', {}, mc, 1);
    }
    this.setHandlers(n, m, i);
  }
  
  this.setHandlers = function(n, m, i) {
    n.vCap = m;
    m.addEventListener('input', this.planFind.bind(this, n, 0), false);
    m.addEventListener('keydown', this.key.bind(this, n), false);
    if(i) i.addEventListener('click', this.go.bind(this, n), false);
  }
  
  this.planFind = function(n, now){
    if(n.vCap.value===''){
      this.fix(n, '', '');
    }
    else{
      this.seq++;
      n.vSeq = this.seq;
      if(n.vWait) clearTimeout(n.vWait);
      if(n.vCache && n.vCache[n.vCap.value]) this.openList(n, n.vCache[n.vCap.value]);
      else n.vWait = setTimeout(this.find.bind(this, n), now ? 0 : this.opt.wait);
    }
  }
  
  this.find = function(n){
    var u = n.getAttribute(this.opt.attrLookup);
    u = d1.arg(u, {
        //value: n.vCap.value,
        seq: this.seq,
        time: (new Date()).getTime()
    }).replace(/\{q\}/, n.vCap.value);
    n.vCur = null;
    d1.ajax(u, null, this.list.bind(this, n.vCap.value, this.seq, n));
  }
  
  this.list = function(u, seq, n, req, nn, e){
    var d = JSON.parse(req.responseText);
    if(seq==n.vSeq) this.openList(n, d.data, e);
    //console.log(seq==n.vSeq ? 'use' : 'skip', seq, n.vSeq);
    this.store(n, u, d);
  }

  this.openList = function(n, d, e){
    if(e) e.stopPropagation();
    this.closeList();
    var pop = n.thePop;
    pop.appendChild(this.win);//.pop
    this.win.vRel = n.vCap;
    d1.setState(this.win, 1);
    this.build(n, d);
  }
  
  this.closeList = function(){
    d1.setState(this.win, 0);
  }
  
  this.build = function(n, d){
    while(this.win.firstChild) this.win.removeChild(this.win.firstChild);
    var ul = d1.ins('ul', '', {className: 'nav let'}, this.win);
    var w, a, j = 0;
    var go = n.getAttribute(this.opt.attrGoto);
    for(var i in d){
      w = d1.ins('li', '', {}, ul);
      a = d1.ins('a', '', {href: go ? go.replace(/\{id\}/, d[i].id) : '#' + d[i].id, className: '-pad -hover'}, w);
      d1.ins('span', d[i].nm, {}, a);
      if(d[i].info){
        d1.ins('br', '', {}, a);
        d1.ins('small', d[i].info, {className: 'text-n'}, a);
      }
      if(!go) a.addEventListener('click', this.choose.bind(this, n, a), false);
      j++;
      if(j >= this.opt.max) break;
    }
    if(ul.firstChild) this.hilite(n, ul.firstChild.firstChild);
  }
  
  this.hilite = function(n, a){
    if(n.vCur) n.vCur.classList.remove(d1.opt.cAct);
    a.classList.add(d1.opt.cAct);
    n.vCur = a;
  }
  
  this.hiliteNext = function(n, prev){
    if(n.vCur) {
      var a = n.vCur.parentNode[prev ? 'previousSibling' : 'nextSibling'];
      if(!a) a = n.vCur.parentNode.parentNode[prev ? 'lastChild' : 'firstChild'];
      a = a.firstChild;
      this.hilite(n, a);
    }
  }
  
  this.choose = function(n, a, e){
    if(e) e.preventDefault();
    n.vCur = a;
    this.fix(n, a.hash.substr(1), a.firstChild.textContent);
  }
  
  this.fix = function(n, v, c){
    n.vCur = null;
    n.vSeq = 0;
    if(n.vWait) clearTimeout(n.vWait);
    n.value = v;
    n.vLabel = n.vCap.value = c;
    if(typeof(Event) === 'function') n.dispatchEvent(new Event('input'));//-ie
    this.closeList();
  }
  
  this.key = function(n, e){
    if(e.keyCode == 27) this.fix(n, n.value, n.vLabel);
    else if(e.keyCode == 40 && !d1.getState(this.win)) this.planFind(n, 1);
    else if(e.keyCode == 38 || e.keyCode == 40) this.hiliteNext(n, e.keyCode == 38);
    //else if(e.keyCode == 13) this.choose(n, n.vCur);
    else if(e.keyCode == 13 && n.vCur){
      if(d1.getState(this.win)) e.preventDefault();
      n.vCur.click();
    }
  }
  
  this.go = function(n, e){
    e.preventDefault();
    var u = n.getAttribute(this.opt.attrUrl);
    if(n.value.length>0 && u) location.href = u.replace(/\{id\}/, n.value);
  }

  // update chain
  
  this.updateChain = function(n,e){
    var m = d1.q(n.getAttribute('data-chain'),0);
    if(m){
      if(!n.value) this.setOptions(m,[]);
      else{
        var u = m.getAttribute('data-filter').replace(/\{q\}/,n.value);
        if(m.vCache && m.vCache[u]) this.setOptions(m,m.vCache[u]);
        else d1.ajax(u,m,this.onChainData.bind(this,u));
      }
    }
  }
  
  this.onChainData = function(u,req,n,e){
    var d = JSON.parse(req.responseText);
    this.setOptions(n,d.data);
    this.store(n, u, d);
  }

  this.setOptions = function(n,a){
    while(n.firstChild) n.removeChild(n.firstChild);
    var z = n.getAttribute('data-placeholder') || '';
    if(!a || a.length==0 || z) d1.ins('option',z||'-',{value:''},n);
    if(a) for(var i=0;i<a.length;i++) d1.ins('option',a[i].nm,{value:a[i].id},n);
  }
  
  this.store = function(n,u,d){
    var c = n.getAttribute('data-cache');
    if(c===undefined) c = this.opt.cacheLimit;
    c = parseInt(c, 10);
    if(c){
      if(!n.vCache || Object.keys(n.vCache).length>=c) n.vCache = {};
      if(d) n.vCache[u] = d.data;
    }
  }
  
  d1.plug(this);

})();

  if(typeof module !== "undefined") module.exports = main;
  else if(window) d1lookup = main;
})();