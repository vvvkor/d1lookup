//a.lookup[data-table]
(function(){
main = new(function() {

  "use strict";

  this.opt = {
    attrLookup: 'data-lookup',
    attrCaption: 'data-caption',
    listId: 'lookup-list',
    wait: 300,
    icon: ['edit','&rarr;']
  };
  
  this.seq = 0;
  this.win = null;

  this.init = function(opt) {
    var i;
    for(i in opt) this.opt[i] = opt[i];
    
    this.win = d1.ins('ul', '', {id: this.opt.listId, className: 'hide toggle js-control esc'});
    document.querySelector('body').appendChild(this.win);

    var t = document.querySelectorAll('[' + this.opt.attrLookup + ']');
    for (i = 0; i < t.length; i++) this.prepare(t[i]);
  }

  this.prepare = function(n) {
    var wrap = d1.ins('div','',{className:'nav'},n,1);
    wrap.style.position = 'relative';
    wrap.appendChild(n);
    n.classList.add('bg-n');
    n.type = 'hidden';
    n.vLabel = n.getAttribute('data-caption') || '';//@@
    var m = d1.ins('input', '', {type: 'text', value: n.vLabel}, wrap);
    n.vCap = m;
    m.classList.add('unesc');
    m.autocomplete = 'off';
    d1.ins('', '&nbsp;', {}, wrap);
    var i = wrap.appendChild(d1.svg(this.opt.icon[0],'text-n',this.opt.icon[1]));
    i.style.cursor = 'pointer';
    m.addEventListener('input', this.planFind.bind(this, n, 0), false);
    m.addEventListener('keydown', this.key.bind(this, n), false);
    i.addEventListener('click', this.go.bind(this, n), false);
  }
  
  this.planFind = function(n, now){
    this.seq++;
    n.vSeq = this.seq;
    if(n.vWait) clearTimeout(n.vWait);
    if(n.vCap.value===''){
      n.value = n.vLabel = '';
      this.closeList();
    }
    else n.vWait = setTimeout(this.find.bind(this, n), now ? 0 : this.opt.wait);
  }
  
  this.find = function(n){
    var u = n.getAttribute(this.opt.attrLookup);
    u = d1.arg(u, {
        value: n.vCap.value,
        seq: this.seq,
        t: (new Date()).getTime()
    });
    d1.ajax(u, null, this.list.bind(this, this.seq, n));
    /*
    var ref = this;
    var seq = this.seq;
    setTimeout(function(){ d1.ajax(u, null, ref.list.bind(ref, seq, n)); }, 1000)
    */
  }
  
  this.list = function(seq, n, req, nn, e){
    var d = JSON.parse(req.responseText);
    if(seq==n.vSeq) this.openList(n, d.data, e);
  }

  this.openList = function(n, d, e){
    e.stopPropagation();
    this.closeList();
    //n.parentNode.insertBefore(this.win, n.nextSibling);
    n.parentNode.appendChild(this.win);
    //this.win.style.display = 'block';
    this.win.classList.add('js-show');
    this.win.style.top = (n.vCap.offsetTop + n.vCap.offsetHeight) + 'px';
    this.win.style.left = (n.vCap.offsetLeft) + 'px';
    this.build(n, d);
  }
  
  this.closeList = function(){
    this.win.classList.remove('js-show');
  }
  
  this.shownList = function(){
    return this.win.classList.contains('js-show');
  }
  
  this.build = function(n, d){
    while(this.win.firstChild) this.win.removeChild(this.win.firstChild);
    var w, a;
    for(var i in d){
      w = d1.ins('li', '', {}, this.win);
      a = d1.ins('a', '', {href: '#' + d[i].value, className: '-pad -hover'}, w);
      d1.ins('span', d[i].label, {}, a);
      if(d[i].info){
        d1.ins('br', '', {}, a);
        d1.ins('small', d[i].info, {className: 'text-n'}, a);
      }
      a.addEventListener('click', this.choose.bind(this, n, a), false);
    }
    if(this.win.firstChild) this.hilite(n, this.win.firstChild.firstChild);
  }
  
  this.hilite = function(n, a){
    if(n.vCur) n.vCur.classList.remove('act');
    a.classList.add('act');
    n.vCur = a;
  }
  
  this.hiliteNext = function(n, prev){
    var a = n.vCur.parentNode[prev ? 'previousSibling' : 'nextSibling'];
    if(!a) a = n.vCur.parentNode.parentNode[prev ? 'lastChild' : 'firstChild'];
    a = a.firstChild;
    this.hilite(n, a);
  }
  
  this.choose = function(n, a, e){
    if(e) e.preventDefault();
    n.value = a.hash.substr(1);
    n.vLabel = n.vCap.value = a.firstChild.textContent;
    this.closeList();
  }
  
  this.key = function(n, e){
    if(e.keyCode == 27) n.vCap.value = n.vLabel;
    else if(e.keyCode == 40 && !this.shownList()) this.planFind(n, 1);
    else if(e.keyCode == 38 || e.keyCode == 40) this.hiliteNext(n, e.keyCode == 38);
    else if(e.keyCode == 13) this.choose(n, n.vCur);
  }
  
  this.go = function(n, e){
    e.preventDefault();
    var u = n.getAttribute('data-url');
    if(n.value.length>0 && u) location.href = u.replace(/\{id\}/, n.value);
  }

})();

  if(typeof module !== "undefined") module.exports = main;
  else if(window) d1lookup = main;
})();