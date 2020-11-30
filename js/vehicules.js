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

    //$scope.vehicules = Archs.query(); //Callback to DB
    $scope.tmpVehicle = {}; //Auxiliar variable
    
    $scope.ftLnk = function(str){
      console.log(str);

      return str.split(' ').join('-');
    }
    
    /* ******** Business Functions  ******** */
    /* Validation and Request for new object */
    $scope.createVehicle = function(){
      console.log('<createVehicle> ');
      $scope.msgError = '';
      $scope.msgSuccess='';
      console.log( JSON.stringify($scope.tmpVehicle) );

      /* empty validation */
      if(!$scope.tmpVehicle.sellerName){
        $scope.msgError = 'Full name is required';
      }
      else if(!$scope.tmpVehicle.address){
        $scope.msgError = 'Address is required';
      }
      else if(!$scope.tmpVehicle.apartment){
        $scope.msgError = 'Suite or Apartment  is required';
      }
      else if(!$scope.tmpVehicle.city){
        $scope.msgError = 'City is required';
      }
      else if(!$scope.tmpVehicle.province){
        $scope.msgError = 'State/Province is required';
      }
      else if(!$scope.tmpVehicle.phone){
        $scope.msgError = 'Phone number is required';
      }
      else if(!$scope.tmpVehicle.email){
        $scope.msgError = 'Email is required';
      }
      else if(!$scope.tmpVehicle.make){
        $scope.msgError = 'Vehicle Manufacturer is required';
      }
      else if(!$scope.tmpVehicle.model){
        $scope.msgError = 'Model is required';
      }
      else if(!$scope.tmpVehicle.year){
        $scope.msgError = 'Year is required';
      }

      if($scope.msgError){
        return;
      }
      else{
        //Everything is ok, create the jdpowerlink
        $scope.tmpVehicle.jdpowerlink =  $scope.ftLnk($scope.tmpVehicle.make)+'/'+$scope.ftLnk($scope.tmpVehicle.model)+'/'+$scope.tmpVehicle.year; //dodge/focus-electric/2012

        console.log('Sending to MiddleWare: ', JSON.stringify($scope.tmpVehicle) );
        alert('Send to Persistence (DB)');
        $scope.msgSuccess = 'Successfully created';
        $('#mdInfo').modal('show');
        $scope.resetFields();
      }

    }

    /* Function to reiniti all fields */
    $scope.resetFields = function(){
      $scope.tmpVehicle = {};
    }

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