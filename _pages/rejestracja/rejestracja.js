var MAutocompleter = Class.create({
  last_q: false,
  cache: {},
  kod_id: false,
  initialize: function(inp_el, results_div, service, params){
    this.inp_el = $(inp_el);
    this.results_div = $(results_div);
    this.service = service;
    this._get_add_info = params.get_add_info.bind(this);
    this._get_label = params.get_label.bind(this);
    this._get_href = params.get_href.bind(this);
    
    this.inp_el.observe( 'keyup', this.on_inp_el_keyup.bind(this) ).observe( 'keydown', this.on_inp_el_keydown.bind(this) );
  },
  on_inp_el_keyup: function(event){
    this.q = $F(this.inp_el).strip();
        
    if( this.results_div && event.keyCode==13 ) this.on_inp_enter(event);
    else if( this.results_div && event.keyCode==27 ) this.on_inp_escape(event);
    else if( this.results_div && event.keyCode==38 ) this.on_inp_up(event);
    else if( this.results_div && event.keyCode==40 ) this.on_inp_down(event);
     
    if( this.q ) {      
      new PeriodicalExecuter(this.on_inp_el_keyup_delayed.bind(this), .1);
    } else this.hide_results_div();
  },
  on_inp_el_keydown: function(event){
    if( this.results_div && event.keyCode==38 ) event.stop();
    else if( this.results_div && event.keyCode==40 ) event.stop();
  },
  on_inp_enter: function(event){
  
    if( this.results_div.select('ul li').length==1 ) {
      li = this.results_div.down('ul li');
    } else var li = this.results_div.down('ul li.selected');
    
    if( li ) {
      var a = li.down('a');      
      this.inp_el.value = a.down('p.l').innerHTML.stripTags();
      this.kod_id = li.readAttribute('p');
      this.hide_results_div();
    }
  
  },
  on_inp_escape: function(event){
    this.hide_results_div();
  },
  on_inp_down: function(event){
    var sel_el = this.results_div.down('ul li.selected');
    if( sel_el ) {
    
      var next_el = sel_el.next('li');
      if( !next_el ) next_el = this.results_div.down('ul li');
      if(next_el) {
        this.results_div.down('ul li.selected').removeClassName('selected');
        next_el.addClassName('selected');
      }
    
    } else {
      var el = this.results_div.down('ul li');
      if(el) el.addClassName('selected');
    }
  },
  on_inp_up: function(event){
    var sel_el = this.results_div.down('ul li.selected');
    if( sel_el ) {
    
      var next_el = sel_el.previous('li');
      if( !next_el ) next_el = this.results_div.select('ul li').last();
      if(next_el) {
        this.results_div.down('ul li.selected').removeClassName('selected');
        next_el.addClassName('selected');
      }
    
    } else {
      var el = this.results_div.select('ul li').last();
      if(el) el.addClassName('selected');
    }
  },
  on_inp_el_keyup_delayed: function(pe){
    pe.stop();
    var q = $F(this.inp_el);
    if( this.q==q ) this.on_inp_el_change(q);
  },
  on_inp_el_change: function(q){
    if( this.last_q!=q ) {
      this.last_q = q;
      this.get_data(q);      
    }
  },
  get_data: function(q){
    var data = false;
    for( _q in this.cache ) {
      if( q==_q ) data = this.cache[_q];
    }
    if( data ) this.on_response(q, data); else {
      $S(this.service, {q:q}, this.on_get_data.bind(this));
      this.inp_el.addClassName('loading');
    }
  },
  on_get_data: function(data){
    this.inp_el.removeClassName('loading');
    this.cache[ data[0] ] = data[1];
    this.on_response( data[0], data[1] );
  },
  on_response: function(q, data){
    var mode = data[0];
    var items = data[1];
    if( this.q==q ) {
      
      if( items.length ) {
      
	      var ul = new Element('ul');
		    for( var i=0; i<items.length; i++ ){
		      var li = new Element('li').update('<a href="#"><p class="l">'+this._get_label(items[i])+'</p><p class="r">'+this._get_add_info(items[i])+'</p></a>').writeAttribute('p', items[i][0]);
		      ul.insert( li );
		      li.observe('mouseover', this.on_li_mouseover.bind(this)).down('a').observe('click', function(q, event){
		        this.inp_el.value = q;
		      }.bind(this, items[i][1]));
		    }
		    this.results_div.update(ul).show();
		    this.inp_el.addClassName('open');
		    this.body_click_controller = $$('body').first().on('click', this.on_body_controller.bind(this));
	    
	    } else this.hide_results_div();
	    
    }
  },
  on_li_mouseover: function(event){
    var li = event.findElement('li');
    var ls = this.results_div.down('ul li.selected');
    if( ls ) ls.removeClassName('selected');
    li.addClassName('selected');
  },
  on_body_controller: function(){
    this.hide_results_div();
  },
  hide_results_div: function(){
    this.results_div.hide().update('');
    this.inp_el.removeClassName('open');
    if( this.body_click_controller ) this.body_click_controller.stop();
  }
});


var mautocompleter;
var reg_form_lb_div_id;
var reg_form_lb_div;
var last_checked_email;
var reg_data = {};

$M.addInitCallback(function(){
  if( $('reg_submit') ) {
	  mautocompleter = new MAutocompleter('kod_input', 'kod_choices', 'pna/cq', {get_add_info: function(item){
	      return 'powiat <b>'+item[2]+'</b>';
	    },
	    get_label: function(item){
	      return item[1];
	    },
	    get_href: function(item){
	      return '?p='+item[0]+'&q='+item[1];
	    }
	  });
	  
	  var lbdiv = new Element('div').update('<div class="lb_pass_cont"><p class="h">Powtórz hasło:</p><p><input type="password" id="lb_pass_input" /></p><p class="i">Wpisz powtórnie hasło do Twojego konta, które podałeś/podałaś przed chwilą w formularzu.</p></div><div id="check_div" class="check_cont"></div><div id="save_div" class="calign"><a class="_BTN gray" id="reg_abort" href="#" onclick="$M.lightboxClose(); return false;">&laquo; Wróć do formularza</a> <a class="_BTN orange" id="reg_save" href="#" onclick="reg_save(); return false;">Załóż konto &raquo;</a></div><div id="remember_cont"><label><input type="checkbox" id="remember_checkbox" checked="checked" /> Zapamiętaj mnie na tym komputerze</label></div>');
	  reg_form_lb_div_id = $M.addLightbox( lbdiv, {width: 400, height: 230, title: 'Rejestracja'} );
	  reg_form_lb_div = $M.getLightboxDiv( reg_form_lb_div_id );
	  
	  $('reg_submit').observe('click', reg_form_submit);
  }
  
  if( $('email_ver_btn') ) {
    $('email_ver_btn').observe('click', function(event){
      var v = $F('email_ver_input').strip();
      if( v!='' ) {
      
        $('email_ver_btn').setStyle({visibility: 'hidden'});
        $('email_ver_status').addClassName('_LOADING').update('&nbsp;');
        $('email_ver_input').disable();
        $S('mPortal/users/ver_email', v, function(data){
          if( data===true ) {
            $('email_ver_status').removeClassName('_LOADING').update('Kod został poprawnie zweryfikowany!');
            new PeriodicalExecuter(function(pe){
              pe.stop();
              $('email_ver_div').blindUp();
            }, 2);
          } else {
            $('email_ver_status').removeClassName('_LOADING').update('Niepoprawny kod');
            $('email_ver_btn').setStyle({visibility: 'visible'});
            $('email_ver_input').enable();
          }
        });
        
      }
    });
  }
});

var reg_table_tr_block = function(field){
  $$('#reg_table tr.'+field)[0].addClassName('x').next('tr').addClassName('x');
  return true;
}

var reg_table_tr_unblock = function(field){
  $$('#reg_table tr.'+field)[0].removeClassName('x').next('tr').removeClassName('x');
  return false;
}


var reg_form_submit = function(){
  var data = $('reg_form').serialize(true);
  for( l in data ) data[l] = data[l].strip();
  var dd = Number( data['Date_Day'] );
  var dm = Number( data['Date_Month'] );
  var dy = Number( data['Date_Year'] );

  
  var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if( filter.test( data['email'] ) ) {
    reg_table_tr_unblock('email');;
  } else return reg_table_tr_block('email');  
  
  if( data['pass'].length>=4 ) {
    reg_table_tr_unblock('pass');;
  } else return reg_table_tr_block('pass');  
  
  if( dd && dm && dy ) {
    data['bd_date'] = data['Date_Year']+'-'+data['Date_Month']+'-'+data['Date_Day'];
    reg_table_tr_unblock('bd');
  } else return reg_table_tr_block('bd');  
  
  if( data['gender']=='male' || data['gender']=='female' ) {
    reg_table_tr_unblock('gender');;
  } else return reg_table_tr_block('gender');  
  
  
  
  
  reg_data = data;
  if( data['email']!=last_checked_email ) check_email( data['email'] );
  $M.lightbox( reg_form_lb_div_id, {} );
}

function reg_save(){
  if( reg_data['pass']==$F('lb_pass_input') ) {
    
    $('save_div').addClassName('_LOADING').select('a').invoke('hide');
		$('remember_checkbox').disable();
    
    var params = {};
    params['email'] = reg_data['email'];
    params['pass'] = reg_data['pass'];
    params['bd_date'] = reg_data['bd_date'];
    params['gender'] = reg_data['gender'];
    params['postal_code'] = reg_data['postal_code'];
    params['name'] = reg_data['name'];
    params['remember'] = $('remember_checkbox').checked ? '1' : '0';
    $S('mPortal/users/register', params, function(data){
      if( data ) {
        location = 'http://sejmometr.pl/start';
      } else {
        $('save_div').removeClassName('_LOADING').select('a').invoke('show');
		    $('remember_checkbox').enable();
        alert('Wystąpił błąd');
      }
    });
  
  } else alert("Wpisane hasło nie zgadza się z hasłem podanym w formularzu");
}

function check_email(email){
  $('reg_save').hide();
  $('remember_cont').hide();
  $('check_div').update('').addClassName('_LOADING');
  $S('mPortal/users/check_email', email, function(data){
    
    
    
    last_checked_email = data['email'];
    $('check_div').removeClassName('_LOADING');
    
    if( data['check']===false ) {
      $('check_div').update('<p>Adres:</p><p class="email">'+data['email']+'</p><p>jest dostępny!</p>');
      $('reg_save').show();
      $('remember_cont').show();
    } else {
      $('check_div').update('<p>Adres:</p><p class="email">'+data['email']+'</p><p>nie jest dostępny</p>');
    }
  });
}