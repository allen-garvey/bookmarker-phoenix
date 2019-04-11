<template>
    <div v-if="initialLoadComplete">
        <ul class="list-group tag-list">
            <li class="list-group-item list-group-item-info">
            <div class="tag-list-header">
                <h4>Tags</h4>
                <div><button class="btn btn-success">Add</button></div>
            </div>
            <div class="add-tag-container">
                <div class="add-tag-select-container">
                <select class="form-control tag-select"></select>
                <div>
                    <button class="btn btn-default">Cancel</button>
                    <button class="btn btn-success">Save</button>
                </div>
                </div>
                <div class="add-tag-alert alert alert-warning">
                </div>
            </div>
            </li>
            <li class="list-group-item" v-for="tag in tags" :key="tag.id">
                <div><a :href="tag.urls.show">{{tag.name}}</a></div>
                <div>
                    <button class="btn btn-danger btn-xs" @click="removeTag(tag.id)">Remove</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { getJson, sendJson } from '../ajax.js';

export default {
    name: 'bookmark-tag-list',
    props: {
        bookmarkId: {
            type: String,
            required: true,
        },
    },
    created(){
        getJson(`/api/bookmarks/${this.bookmarkId}/tags`).then((data)=>{
            this.tags = data;
            this.initialLoadComplete = true;
        });
    },
    data(){
        return {
            initialLoadComplete: false,
            tags: [],
        };
    },
    computed: {
    },
    methods: {
        removeTag(tagId){
            const data = {bookmark_id: this.bookmarkId, tag_id: tagId};
            sendJson('/api/bookmarks_tags/', 'DELETE', data).then((json)=>{
                //don't need to do anything here, since we are optimistically assuming succeeeded
            });
            //optimistic remove
            this.tags = this.tags.filter(tag=>tag.id !==tagId);
        },
    }
};
</script>