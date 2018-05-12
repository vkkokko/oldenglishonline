(function($){
    $(document).ready(function(){
        // get reference to search bar
        var $filter = $("#search-filter");

        // get all headers
        var $headings = $('.panel-heading');
        
        // add event handler to search bar keyup event
        $filter.on('keyup', search);

        function search() {
            //get current value of search input
            var searchTerm = $filter.val().toUpperCase();

            // if blank, get the container of each panel and show it
            if (searchTerm.trim() == '') {
                $('.panel').parent().show();
                return;
            }

            // loop through panel headings and compare searchTerm to the panel heading text
            $headings.each(function(idx) {
                var title = $(this).text().toUpperCase();

                if ( title.indexOf(searchTerm) > -1 ) {
                    // if match, show the parent parent (the container, like col-md-4 or whatever)
                    $(this).parent().parent().show();
                } else {
                    // else hide it, because it wasn't a match'
                    $(this).parent().parent().hide();
                }
            });
        }
    });
})(jQuery);