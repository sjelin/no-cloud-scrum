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
			templateUrl: 'bord.html',
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
		when('/epoch/:epoch', {
			templateUrl: 'board.html',
			controller: 'EpochCtrl'
		}).
		when('/story/:id', {
			templateUrl: 'story.html',
			controller: 'StoryCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
});
var statuses = {
	NOT_STARTED: 'Not Started',
	IN_PROGRESS: 'In Progress',
	DONE: 'Done'
}
