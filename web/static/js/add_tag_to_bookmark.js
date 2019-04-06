import $ from './aquery.js';
import { getJson } from './ajax.js';

export function initializeAddTagToBookmark(){
	//initialize variables
	var bookmarkId = $('[data-bookmark-id]').data('bookmark-id');
	var tagOptionTemplate = $.template($('#add_tag_option_template').html());
	var tagSelectTag = $('.add-tag-container select');
	var tagListItemTemplate = $.template($('#add_tag_tag_item_template').html());
	var tagList = $('.tag-list');
	var addTagContainer = $('.add-tag-container');
	var addTagButton = $('[data-role="add-tag-button"]');

	//populate and show tag select form
	$('[data-role="add-tag-button"]').on('click', function(e){
		$(this).hide();

		getJson(`/api/tags/bookmark/${bookmarkId}/unused`).then((data)=>{
			tagSelectTag.html('');
			data.forEach((tag)=>{
				tagSelectTag.append(tagOptionTemplate.render({
					id: tag.id, 
					name: tag.attributes.name
				}));
			});
			if(data.length == 0){
				addTagContainer.addClass('error');
			}

			addTagContainer.show();
		});
	});
	//reset tag select and add button
	function resetAddTagForm(){
		addTagButton.show();
		addTagContainer.hide();
	}

	//cancel adding tag
	$('[data-role="cancel-tag-button"]').on('click', function(event) {
		resetAddTagForm();
	});

	//save tag
	$('[data-role="save-tag-button"]').on('click', function(event){
		var tagId = $('.add-tag-container select').val();
		$.ajax({
			url: '/api/bookmarks_tags/',
			method: 'POST',
			dataType: 'json',
			data: {bookmark_id: bookmarkId, tag_id: tagId},
			success: function(response){
				resetAddTagForm();
				if(response.error){
					return;
				}
				tagList.append(tagListItemTemplate.render({tagId: response.data.attributes.tag.id, tagName: response.data.attributes.tag.attributes.name}));
			}
		});
		
	});

	//remove tag
	$('.tag-list').on('click', '[data-role="remove-tag-button"]', function(event) {
		var removeButton = $(this);
		var tagId = removeButton.closest('[data-tag-id]').data('tag-id');
		$.ajax({
			url: '/api/bookmarks_tags/',
			method: 'DELETE',
			dataType: 'json',
			data: {bookmark_id: bookmarkId, tag_id: tagId},
			success: function(response){
				if(response.error){
					return;
				}
				removeButton.closest('.list-group-item').remove();
			}
		});
		
	});
};