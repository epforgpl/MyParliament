<div class="_s_browser _search_browser">
  <div class="_performance" style="display: none;">
    <ul>
      {if $search->performance.data_query}<li><p class="l">data_query</p><p class="v">{$search->performance.data_query}</p></li>{/if}
      {if $search->performance.found_rows_query}<li><p class="l">found_rows_query</p><p class="v">{$search->performance.found_rows_query}</p></li>{/if}
      {if $search->performance.opening_files}<li><p class="l">opening_files</p><p class="v">{$search->performance.opening_files}</p></li>{/if}
      <li><p class="l">total</p><p class="v">{$search->performance.total}</p></li>
    </ul>
  </div>
	<div class="s_browser_filters_cont">
		<form class="s_browser_form" method="get" action="">
	  
		
		{if $mode eq 'browse'}
					  
		  <div class="aoverflow s_browser_bar">
	      <div class="lalign lfloat">
	      
	        <p class="s_browser_counter">{$nav_str}</p>
	      
	      </div><div class="ralign rfloat">
	      
	        <div class="s_browser_pagination upper">{$pagination.str}</div>
	        <div class="alerts_btns_cont">
	          <input type="button" value="Ustaw powiadomienie..." class="mBtn yellow alert_btn" />
	        </div>
	        
	      </div>
	    </div>
	    <div class="s_browser_order_div">
	      <p>Sortowanie: <a{if $smarty.get.o eq 't'} class="s"{/if} href="?q={$smarty.get.q|escape:"html"}&d={$smarty.get.d|escape:"html"}&o=t">trafność</a> <a{if $smarty.get.o eq 'd'} class="s"{/if} href="?q={$smarty.get.q|escape:"html"}&d={$smarty.get.d|escape:"html"}&o=d">data</a></p>
	    </div>
	    
    {/if}
		
		
		
		
		
		<div class="s_browser_cont">
						    
			<div class="s_browser">   
				  
				  <div class="s_browser_cont_div">
				    <div class="s_brwoser_main_div">
				      
				      
				      
				      {if $mode eq 'browse'}
					    
					      <ul class="s_browser_results_ul">
					        {section name="items" loop=$items}
					          {include file=$list_item_path class=$items[items]|get_class item=$items[items] iteration=$smarty.section.items.iteration}
					        {/section}
					      </ul>
					      
					      <div class="s_browser_pagination lower">{$pagination.str}</div>
				      
					    {/if}
				      
				      
				      
				      
				    </div>
				  </div>
				  
				  
			  
			</div>
	
	
	
		</div>
		
	  </form>
	</div>
</div>