let find_button = document.querySelector('.block__home-page-filter-find-button');
find_button.addEventListener('click', () => {
    let collectionHandle = document.querySelector(".header-search-filter").getAttribute("data-collection");
   
    const baseURL = "https://6a353a-3.myshopify.com/collections/"+collectionHandle;
    let selectValArray = [];
    let filterval_Element = document.querySelectorAll(".block__home-page-filter-list-select");
        filterval_Element.forEach(selectall => {
            if (selectall.options[selectall.selectedIndex] && !selectall.options[selectall.selectedIndex].disabled) {
                selectValArray.push(selectall.value);
            }
        });
    const formattedTags = selectValArray.map(function(tag) {
        const tagReplace = tag.replace(' ', '-').replace(':', '-').replace(' ', '').replace('.', '-');
        return tagReplace;
    });
    
    const filterTags = formattedTags.join('+');
    const finalURL = `${baseURL}/${filterTags}`;
    window.location.href = finalURL;

});

