import Vue from 'vue';
import BookmarkTagList from './vues/bookmark_tag_list.vue';


(function(){
    const bookmarkTagListContainer = document.getElementById('bookmark_tag_list');

    if(bookmarkTagListContainer){
        const bookmarkId = bookmarkTagListContainer.dataset.bookmarkId;

        new Vue({
            el: bookmarkTagListContainer,
            render: h => h(BookmarkTagList, {props: {bookmarkId}}),
        });
    }
})();



