import $ from './aquery.js';
import { getJson, sendJson } from './ajax.js';

export function initializeAddTagToBookmark(){
	//initialize variables
	const bookmarkId = $('[data-bookmark-id]').data('bookmark-id');
	const tagOptionTemplate = $.template($('#add_tag_option_template').html());
	const tagSelectTag = $('.add-tag-container select');
	const tagListItemTemplate = $.template($('#add_tag_tag_item_template').html());
	const tagList = $('.tag-list');
	const addTagContainer = $('.add-tag-container');
	const addTagButton = $('[data-role="add-tag-button"]');

	//populate and show tag select form
	$('[data-role="add-tag-button"]').on('click', function(event){
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
	$('[data-role="cancel-tag-button"]').on('click', (event)=>{
		resetAddTagForm();
	});

	//save tag
	$('[data-role="save-tag-button"]').on('click', (event)=>{
		const tagId = $('.add-tag-container select').val();
		const data = {bookmark_id: bookmarkId, tag_id: tagId};

		sendJson('/api/bookmarks_tags/', 'POST', data).then((json)=>{
			resetAddTagForm();
			if(json.error){
				return;
			}
			const tag = json.data.attributes.tag;
			tagList.append(tagListItemTemplate.render({
				tagId: tag.id, 
				tagName: tag.attributes.name
			}));
		});
	});

	//remove tag
	$('.tag-list').on('click', '[data-role="remove-tag-button"]', function(event){
		const removeButton = $(this);
		const tagId = removeButton.closest('[data-tag-id]').data('tag-id');
		const data = {bookmark_id: bookmarkId, tag_id: tagId};

		sendJson('/api/bookmarks_tags/', 'DELETE', data).then((json)=>{
			if(json.error){
				return;
			}
			removeButton.closest('.list-group-item').remove();
		});		
	});
};