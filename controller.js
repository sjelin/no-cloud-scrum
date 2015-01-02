var scrumApp = angular.module('scrumApp', ['ngRoute', 'scrumFilters']);

scrumApp.config(function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'board.html',
			controller: 'NotStartedCtrl'
		}).
		when('/sprint', {
			templateUrl: 'board.html',
			controller: 'SprintCtrl'
		}).
		when('/done', {
			templateUrl: 'board.html',
			controller: 'DoneCtrl'
		}).
		when('/metrics', {
			templateUrl: 'metrics.html',
			controller: 'MetricsCtrl'
		}).
		when('/json', {
			templateUrl: 'json.html',
			controller: 'JSONCtrl'
		}).
		when('/story/:id', {
			templateUrl: 'story.html',
			controller: 'StoryCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
});

function boardCtrl($scope, title, storyStatus, epoch) {
	$scope.title = title;
	$scope.status = storyStatus;
	$scope.epoch = epoch;
	$scope.epochs = (window.epochs = window.epochs || []);
	$scope.statuses = [
		statuses.NOT_STARTED,
		statuses.IN_PROGRESS,
		statuses.DONE
	];
	$scope.goToStory = function(storyID) {
		window.location.hash = '#/story/'+storyID;
	};
	$scope.newStory = function(epoch) {
		var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
			replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		epoch.stories.push({id: id, status: statuses.NOT_STARTED,
			 dateAdded: new Date().getTime()});
		$scope.goToStory(id);
	};
	$scope.newEpoch = function() {
		$scope.epochs.push({name: 'New Epoch', stories: [],
			dateAdded: new Date().getTime()});
	};
	$scope.deleteStory = function(story) {
		for(var i in $scope.epochs)
			$scope.epochs[i].stories = $scope.epochs[i].stories.filter(
				function(s) {
					return s !== story;
				}
			)
	};
	$scope.deleteEpoch = function(epoch) {
		$scope.epochs = window.epochs = $scope.epochs.filter(function(e) {
			return e !== epoch;
		});
	};
	$scope.finishEpoch = function(epoch) {
		epoch.status = statuses.DONE;
		epoch.stories.forEach(function(story) {
			if(story.status == storyStatus) {
				story.status = statuses.DONE;
			}
		});
	};
}

scrumApp.controller('NotStartedCtrl', function ($scope) {
	boardCtrl($scope, 'Inactive Stores', statuses.NOT_STARTED);
});

scrumApp.controller('SprintCtrl', function ($scope) {
	boardCtrl($scope, 'Current Sprint', statuses.IN_PROGRESS);
});

scrumApp.controller('DoneCtrl', function ($scope) {
	boardCtrl($scope, 'Finished Stories', statuses.DONE);
});

scrumApp.controller('StoryCtrl', function ($scope, $routeParams, $location) {
	var story;
	var epoch = window.epochs.filter(function(epoch) {
		return ((story = story || epoch.stories.filter(function(story) {
			return story.id == $routeParams.id;
		})[0]) == story) && story;
	})[0];
	if(!story)
		$location.path('/');
	else {
		$scope.story = story;
		$scope.epoch = epoch.name;
		$scope.statuses = [
			statuses.NOT_STARTED,
			statuses.IN_PROGRESS,
			statuses.DONE
		];
		$scope.deleteStory = function() {
			epoch.stories = epoch.stories.filter(function(s) {
				return s !== story;
			});
			$location.path('/');
		};
	}
});

scrumApp.controller('MetricsCtrl', function ($scope) {
});

scrumApp.controller('JSONCtrl', function ($scope) {
	var data = {};
	data.epochs = window.epochs || [];
	$scope.rawJSON = JSON.stringify(data);

	$scope.load = function() {
		data = JSON.parse($scope.rawJSON);
		window.epochs = data.epochs;
	}
});

window.epochs = JSON.parse(localStorage.getItem('epochs') || '[]');
setInterval(window.onbeforeunload = function() {
	localStorage.setItem('epochs', JSON.stringify(window.epochs || []));
}, 60000);//Autosave
