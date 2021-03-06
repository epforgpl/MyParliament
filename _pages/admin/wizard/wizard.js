var WIZARD = Class.create({
	initialize : function( aliases, fields ) {
		this.org_aliases = aliases;
		this.org_fields = fields;
		this.aliases = $A();
		this.fields = $A();
		this.alias = '';
		if ($('btn_step_1'))
			$('btn_step_1').observe('click', this.step_1.bind(this));
		if ($('btn_step_2'))
			$('btn_step_2').observe('click', this.step_2.bind(this));
		if ($('btn_step_3'))
			$('btn_step_3').observe('click', this.step_3.bind(this));
		if ($('btn_add_step_3'))
			$('btn_add_step_3').observe('click', this.add_step_3.bind(this));
		if( $('step_1') ){
			$('step_1').show();
		}
	},
	step_1 : function( e ){
		var error = false;
		e.currentTarget.up().up().select('.error').invoke( 'removeClassName','active' );
		if( $F('f_nazwa') == '' ){
			$('f_nazwa').up().down('span', 0).addClassName( 'active' );
			error = true;
		}
		if( $F('f_alias') == '' ){
			$('f_alias').up().down('span', 1).addClassName( 'active' );
			error = true;
		}
		if( $F('f_results_class') == '' ){
			$('f_results_class').up().down('span', 1).addClassName( 'active' );
			error = true;
		}
		if( $F('f_table') == '' ){
			$('f_table').up().down('span', 0).addClassName( 'active' );
			error = true;
		}
		
		if( error ){
			return;
		}
		
		var params = {};
		params.alias = $F('f_alias');
		params.results_class = $F('f_results_class');
		params.table =  $F('f_table');
		$S( 'admin/wizard/step_1', params, this.on_update_step_1.bind(this) );
	},
	on_update_step_1 : function( d ){
		if( d.alias == 1){
			$('f_alias').up().down('span', 0).addClassName( 'active' );
		}
		if( d.results_class == 1 ){
			$('f_results_class').up().down('span', 0).addClassName( 'active' );
		}
		if( d.fields ){
			this.alias = $F('f_alias');
			var fields = '';
			for( i=0; i<d.fields.length; i++ ){
				fields += '<p>';
				fields += '<label>'+ d.fields[i]+'</label>';
				fields += '<input type="text" value="" name="fields[]">';
				fields += '<input type="hidden" value="'+d.fields[i]+'" name="keys[]">';
				fields += '</p>';
			}
			$('inputs_step_2').update( fields );
			
			$('step_1').hide();
			$('step_2').show();
		}
	},
	step_2 : function( e ){
		var fields = $$('[name="fields[]"]' );
		var res = $A();
		for( i=0; i< fields.length; i++ ){
			if( fields[i].value != '' ){
				res.push(fields[i].value );
			}
		}
		this.fields = this.org_fields;
		this.fields[ this.alias  ] = res;
		this.aliases = this.org_aliases;
		this.aliases.unshift( this.alias );

		$('step_2').hide();
		$('step_3').show();
	},
	add_step_3 : function( e ){
		var new_div = new Element('div',{'style': 'clear: both;'});
		new_div.update( '<select name="c_alias[]"><option></option></select><select name="c_field[]"></select><input type="button" value="Usuń" class="mBtn red">' );
		var select = new_div.down('select', 0);
		var button = new_div.down('input', 0);
		
		for( var i=0; i<this.aliases.length; i++ ) {
		    var opt = new Element('Option');
		    opt.writeAttribute('value', this.aliases[i]);
		    opt.update( this.aliases[i] );
		    select.insert( opt );
	    }
	    select.observe('change', this.update_select.bind(this));
	    button.observe('click', this.remove_selects.bind(this));
	    $('inputs_step_3').insert( new_div );
	},
	update_select : function( e ){
		var select = e.currentTarget;
		var target = select.up( 'div' ).down('select', 1);
		var fields = this.fields[ $F( select ) ];
		target.length = 0;
		var opt = new Element('Option', {'value' : ''}).update( '' );
		target.insert( opt );
		  
		for( var i=0; i<fields.length; i++ ) {
			var opt = new Element('Option',{ 'value' : fields[i] }).update( fields[i] );
			target.insert( opt );
		}
	},
	remove_selects : function( e ){
		var select = e.currentTarget;
		select.up( 'div' ).remove();
	},
	step_3 : function( e ){
		var c_aliases = $$( '[name="c_alias[]"]' );
		var c_fields = $$( '[name="c_field[]"]' );
		var target = $('f_sort_field');
		for( i = 0; i < c_aliases.length; i++ ){
			var opt = new Element('Option',{ 'value' : $F(c_aliases[i]) + '.' + $F(c_fields[i]) }).update( $F(c_aliases[i]) + '.' + $F(c_fields[i]) );
			target.insert( opt );
		}
		
		$('step_3').hide();
		$('step_4').show();		
	}
});
