'use strict';

/* App Module */
let vehicleApp = angular.module('vehicleApp', ['ngRoute', 'appServices']);




/* Controllers */
vehicleApp
.controller('mainController', function($scope,$rootScope,$routeParams, $location, $route, $templateCache, Archs){
  $scope.today = new Date();
  $scope.msgSuccess;
  $scope.msgError;
  
  /* Load initialization and Cataloge from json */
  $scope.cat={};
  $scope.cat.manufacts = Archs.makers();
  $scope.cat.models = []; //Load in Manufacturer selection
  $scope.cat.years = [];  //FIll with years attribute in Model 

  /* Temporal for setting years combo */
  for(let year = 1990; year<2021; year++){
    $scope.cat.years.push(year);
  }
  console.log('$scope.cat: ', $scope.cat );



  $scope.vehicules = Archs.query(); //Callback to DB


})
.controller('homeCtrl', function($scope, $rootScope,$routeParams, $location, $route, $templateCache, Archs){
  document.title = "Welcome to Our Application";
  console.log('homeCtrl...');

  
})
.controller('vehicleCtrl', function($scope, $rootScope,$routeParams, $location, $route, $templateCache, Archs){
    console.log('vehicleCtrl...');
    document.title = "Add a new vehicle";

   

})
.controller('listCtrl', function($scope, $rootScope,$routeParams, $location, $route, $templateCache, Archs){
  console.log('listCtrl...');
  document.title = "Find your vehicle";
});



/* >>>>>>>>>>>>>> Services <<<<<<<<<<<<<< */
let appServices = angular.module('appServices', ['ngResource']);

appServices.factory('Archs', ['$resource',
  function($resource){
    return $resource('./json/:fileName.json', {}, {
      query: {method:'GET', params:{fileName:'vehicules_db'}, isArray:true},
      makers: {method:'GET', params:{fileName:'manufacturer'}, isArray:true}
    });
  }]);


  /* >>>>>>>>>>>>>> Routing <<<<<<<<<<<<<< */
vehicleApp.config(function ($locationProvider, $routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/welcome.html'
  })
  .when('/new', {  /* new Vehicle creation */
    templateUrl: 'views/new.html'
    
  })
  .when('/vlist', {  /* List of vehicles */
    templateUrl: 'views/vlist.html'    
  })
  .otherwise({
  redirectTo: '/'
  });
});