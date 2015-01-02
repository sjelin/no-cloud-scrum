var scrumFilters = angular.module('scrumFilters', []);

function filterStories(stories, status) {
	return stories.filter(function(story) {
		return !status || (story.status == status);
	});
}

scrumFilters.filter('filterEpochs', function() {
	return function(epochs, status, epoch) {
		return epochs.filter(function(epoch) {
			if(filterStories(epoch.stories, status).length != 0)
				return true;
			return 	(epoch.status != statuses.DONE) &&
					(status == statuses.NOT_STARTED);
		});
	};
});

scrumFilters.filter('filterStories', function() {
	return function(stories, status) {
		return filterStories(stories, status);
	};
});
