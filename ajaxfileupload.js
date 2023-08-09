
jQuery.extend({
	handleError: function( s, xhr, status, e ) 		{
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context || s, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
		}
	},
	
    createUploadIframe: function(id, uri)
	{
			//create frame
            var frameId = 'jUploadFrame' + id;
            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
			if(window.ActiveXObject)
			{
                if(typeof uri== 'boolean'){
					iframeHtml += ' src="' + 'javascript:false' + '"';

                }
                else if(typeof uri== 'string'){
					iframeHtml += ' src="' + uri + '"';

                }	
			}
			iframeHtml += ' />';
			jQuery(iframeHtml).appendTo(document.body);

            return jQuery('#' + frameId).get(0);			
    },
    createUploadForm: function(id, fileElementId, data, params)
	{
		//create form	
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');	
		if(data)
		{
			for(var i in data)
			{
				jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
			}			
		}		
		var oldElement = jQuery('#' + fileElementId);
		var newElement = jQuery(oldElement).clone().change(function() {
			$.reachFileUpload(params);
		});
		jQuery(oldElement).attr('id', fileId);
		jQuery(oldElement).before(newElement);
		jQuery(oldElement).appendTo(form);


		
		//set attributes
		jQuery(form).css('position', 'absolute');
		jQuery(form).css('top', '-1200px');
		jQuery(form).css('left', '-1200px');
		jQuery(form).appendTo('body');		
		return form;
    },

    ajaxFileUpload: function(s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime();        
		var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data), s.params);
		var io = jQuery.createUploadIframe(id, s.secureuri);
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;		
        // Watch for a new set of requests
        if ( s.global && ! jQuery.active++ )
		{
			jQuery.event.trigger( "ajaxStart" );
		}            
        var requestDone = false;
        // Create the request object
        var xml = {};   
        if ( s.global )
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout)
		{			
			io = document.getElementById(frameId);
            try 
			{				
				if(io.contentWindow)
				{
					 xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                	 xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
					 
				}else if(io.contentDocument)
				{
					 xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
				}						
            }catch(e)
			{
				jQuery.handleError(s, xml, null, e);
			}
            if ( xml || isTimeout == "timeout") 
			{				
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if ( status != "error" )
					{
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData( xml, s.dataType );    
                        // If a local callback was specified, fire it and pass it the data
                        if ( s.success )
                            s.success( data, status );
    
                        // Fire the global callback
                        if( s.global )
                            jQuery.event.trigger( "ajaxSuccess", [xml, s] );
                    } else
                        jQuery.handleError(s, xml, status);
                } catch(e) 
				{
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if( s.global )
                    jQuery.event.trigger( "ajaxComplete", [xml, s] );

                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active )
                    jQuery.event.trigger( "ajaxStop" );

                // Process result
                if ( s.complete )
                    s.complete(xml, status);

                jQuery(io).unbind()

                setTimeout(function()
									{	try 
										{
											jQuery(io).remove();
											jQuery(form).remove();	
											
										} catch(e) 
										{
											jQuery.handleError(s, xml, null, e);
										}									

									}, 100);

                xml = null;

            }
        };
        // Timeout checker
        if ( s.timeout > 0 ) 
		{
            setTimeout(function(){
                // Check to see if the request is still happening
                if( !requestDone ) uploadCallback( "timeout" );
            }, s.timeout);
        }
        try 
		{

			var form = jQuery('#' + formId);
			jQuery(form).attr('action', s.url);
			jQuery(form).attr('method', 'POST');
			jQuery(form).attr('target', frameId);
            if(form.encoding)
			{
				jQuery(form).attr('encoding', 'multipart/form-data');      			
            }
            else
			{	
				jQuery(form).attr('enctype', 'multipart/form-data');			
            }			
            jQuery(form).submit();

        } catch(e) 
		{			
            jQuery.handleError(s, xml, null, e);
        }
		
		jQuery('#' + frameId).load(uploadCallback	);
        return {abort: function () {}};	

    },
    
    reachFileUpload: function(p) {
		/*
		 * ajaxه¼‚و­¥وڈگن؛¤ن¹‹ه‰چه؛”è¯¥هˆ¤و–­و–‡ن»¶çڑ„ç±»ه‍‹ï¼Œç„¶هگژهپڑه‡؛é™گهˆ¶م€‚
		 */
    	
    	var typeValue = $('#' + p.fileInputId).val();
    	typeValue = typeValue.substring(typeValue.lastIndexOf("\\")+1,typeValue.length);
    	typeValue = typeValue.substring(typeValue.lastIndexOf("\.")+1,typeValue.length);
    	if(!/png|php|gif/gi.test(typeValue.toLowerCase())) {
    		alert(Global.i18n("common.image.validate"));
    		return false;
    	}
    	
    	// ه°†ه‰چن¸€و¬،çڑ„ه°پé‌¢ه›¾ç‰‡و–‡ن»¶هگچن¸ٹن¼ ï¼Œن»¥ن¾؟هˆ é™¤
    	//p.data['oldname'] = $('#' + p.coverNameId).val();
    	p.data = p;
    	
		$.ajaxFileUpload({
			params: p,
			url: p.action,
			secureuri: false,
			fileElementId: p.fileInputId,
			dataType: 'JSON',
			data:p.data,
			success: function(data, status){
				var filename = $.parseJSON(data).filename;
				var randomCode=Math.random().toString(); 
				$(p.coverHolderId).attr('src', p.coverPath + filename + "?random=" + randomCode);
				$('#' + p.coverNameId).val(filename);
				
				// ه›‍è°ƒه‡½و•°
				if(p.callback){
					p.callback();
				}
				
			},
			error: function(data, status, e) {
				alert('request error!');
			}
		});
	
    },

    uploadHttpData: function( r, type ) {
        var data = !type;
        if(type) {type = type.toLowerCase();}
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // هœ¨firefoxه’Œoperaوµڈè§ˆه™¨ن¸‹هژ»وژ‰è‡ھهٹ¨ن؛§ç”ںçڑ„<pre>و ‡ç­¾
        data = data.replace(/<pre[\s]*[^>]*>/gi, '').replace(/<\/pre>/gi, '');
        // If the type is "script", eval it in global context
        if ( type == "script" )
            jQuery.globalEval( data );
        // Get the JavaScript object, if JSON is used.
        if ( type == "json" ){}
        // evaluate scripts within html
        if ( type == "html" )
            jQuery("<div>").html(data).evalScripts();

        return data;
    }
});


/**
 * è§†é¢‘ن¸“è¾‘ه°پé‌¢ï¼Œç”¨وˆ·ه¤´هƒڈن¸ٹن¼ وڈ’ن»¶
 * by Adams Tsui
 * 2014-08-13 Reach
 */
;(function($) {
	$.fn.ajaxUploader = function(options) {
		var defaults = {'data': {}},
		$this = $(this),
		params = $.extend(true, options, defaults);
		params['fileInputId'] = $this.attr('id');
		
		if(!params.action || !params.fileInputId) {
			return false;
		} else {
			$this.change(function() {
				$.reachFileUpload(params);
			});
		}
	};
})(jQuery);

