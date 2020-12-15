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
  for(let year = 2021; year>=2018; year--){
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
    $scope.vehinfo = {}; //Just for Success displaying
    
    console.log('$scope.vehicule.length: ', $scope.vehicules.length );
    console.log('$scope.vehicule: ', $scope.vehicules )

    
    $scope.ftLnk = function(str){
      console.log(str);

      return str.split(' ').join('-');
    }
    
    /* ******** Business Functions  ******** */

    $scope.selModel = function(){
      console.log('<selModel>')
      let idMaker = $scope.tmpVehicle.make;
      console.log('Loading models for idMaker: ', idMaker );

      $scope.cat.manufacts.forEach( function(maker, index) {
        if(maker.idMaker == idMaker) {
          console.log('Reloading cat.model: ', maker.models )
          $scope.cat.models = angular.copy(maker.models);
        } 
      });      
    }
    
    /* Verifies correct format for email */
    $scope.validEmail = function(){
      console.log('<validEmail>  ');
      $scope.msgError = '';
      $scope.msgSuccess='';

      if($scope.tmpVehicle.email){
        console.log('Validating email: ', $scope.tmpVehicle.email );
        let email = angular.copy($scope.tmpVehicle.email);

        //Using Regular Expression
        let emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(!email.match(emailregex)){
          $scope.msgError = 'Your email "'+ email + '" is not valid, please review';
          $('#mdInfo').modal('show');
          $scope.tmpVehicle.email = '';
        }
      }
    }

    /* Verifies correct format for phone number */
    $scope.validPhone = function(){
      console.log('<validPhone>  ');
      $scope.msgError = '';
      $scope.msgSuccess='';

      console.log('Validating phone: ', $scope.tmpVehicle.phone );
      if($scope.tmpVehicle.phone){
        let phoneNumber = angular.copy($scope.tmpVehicle.phone);
        //Using Regular Expression
        var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        // /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if(!phoneNumber.match(phoneno)){
          $scope.msgError = 'Phone Number "'+ phoneNumber + '" is not valid, please review';
          $('#mdInfo').modal('show');
          $scope.tmpVehicle.phone = '';
        }
      }
    }

    /* Validation and Request for new object */
    $scope.createVehicle = function(){
      console.log('<createVehicle> ');
      $scope.vehinfo = {};
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
        
        let nMake, lnkMake, nModel, lnkModel;

        $scope.cat.manufacts.forEach( function(maker, index) {
          if(maker.idMaker == $scope.tmpVehicle.make) {
            nMake = maker.description;
            lnkMake = maker.token;
            console.log('Iterating models: ', maker.models )
            maker.models.forEach(function(model, index){
              if(model.idModel == $scope.tmpVehicle.model){
                nModel = model.description;
                lnkModel = model.token;
              }
            });
          } 
        });

        $scope.tmpVehicle.make = nMake;
        $scope.tmpVehicle.model = nModel;
        $scope.tmpVehicle.jdpowerlink =  $scope.tmpVehicle.year+'/'+lnkMake+'/'+lnkModel;

        //Generating id (Simulation of DB asignation )
        $scope.tmpVehicle.id = $scope.vehicules.length +1;

        console.log('Sending to MiddleWare: ', JSON.stringify($scope.tmpVehicle) );
        //alert('Send to Persistence (DB)');
        $scope.vehicules.push(angular.copy($scope.tmpVehicle));

        
        console.log('$scope.vehicule.length: ', $scope.vehicules.length )
        $scope.msgSuccess = 'Successfully created';
        $('#mdInfo').modal('show');
        $scope.vehinfo = angular.copy($scope.tmpVehicle);
        $scope.resetFields();
      }

    }

    /* Function to reiniti all fields */
    $scope.resetFields = function(){
      $scope.tmpVehicle = {};
    }

    $scope.gotoList = function(){
      $('.modal').modal('hide');

      setTimeout($scope.redir(), 1500);
 
    }

    $scope.redir = function(){
      //alert('redirecting')
      $('.modal').modal('hide');
      $location.path('/vlist')
    }

})
.controller('listCtrl', function($scope, $rootScope,$routeParams, $location, $route, $templateCache, Archs){
  console.log('listCtrl...');
  document.title = "Find your vehicle";


  $('.modal').modal('hide');
  console.log('$scope.vehicule.length: ', $scope.vehicules.length );
  console.log('$scope.vehicule: ', $scope.vehicules )
  $scope.orderProp = 'id'; // attribute in json
  $scope.orderdesc = true; //Descendent

  // scope.searchFor = null; //Predefined filter

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