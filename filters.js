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

scrumFilters.filter('shortenEpoch', function() {
	return function(name) {
		if(name.length < 8)
			return name;
		if(name.indexOf(' ') != -1)
			return name.split(' ').map(function(word) {
				return word[0].toUpperCase();
			}).join('');
		var nm = name.split('').filter(function(letter, i) {
			return !(i && ({a:1,e:1,i:1,o:1,u:1})[letter]);
		}).join('');
		if(nm.length < 8)
			return nm;
		return name.substr(0,6)+'...';
	};
});
