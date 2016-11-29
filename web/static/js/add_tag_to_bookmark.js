

var AddTagToBookmark = {};
AddTagToBookmark.init = function($){
	$('[data-role="add-tag-button"]').on('click', function(e){
		$(this).hide();

		$.ajax({
			url: '/api/tags/bookmark/1/unused',
			type: 'GET',
			dataType: 'json',
			success: function(data){
				if(data.error){
					console.log(data);
					return;
				}
				var tagOptionTemplate = $.template($('#add_tag_option_template').html());
				var tagSelectTag = $('.add-tag-container select');
				tagSelectTag.html('');
				data.data.forEach(function(tag){
						tagSelectTag.append($.parseHTML(tagOptionTemplate.render({id: tag.id, name: tag.attributes.name})));
					}
				);
				$('.add-tag-container').show();
			}
		});
	});
	function resetAddTagForm(){
		$('[data-role="add-tag-button"]').show();
		$('.add-tag-container').hide();
	}

	$('[data-role="cancel-tag-button"]').on('click', function(event) {
		resetAddTagForm();
	});

	$('[data-role="save-tag-button"]').on('click', function(event){
		var bookmarkId = 1;
		var tagId = $('.add-tag-container select').val();
		$.ajax({
			url: '/api/bookmarks_tags/',
			method: 'POST',
			data: {bookmark_id: bookmarkId, tag_id: tagId},
			success: function(data){
				console.log(data);
				resetAddTagForm();
			}
		});
		
	});
};

AddTagToBookmark.init(aQuery);